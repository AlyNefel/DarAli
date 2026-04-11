import { IRoomType, IBooking, IAvailability, ILock } from '../models';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  writeBatch, 
  increment, 
  Timestamp, 
  addDoc, 
  deleteDoc, 
  runTransaction,
  orderBy,
  limit
} from 'firebase/firestore';
import { differenceInDays, addDays, startOfDay } from 'date-fns';

export class AvailabilityService {
  /**
   * Checks if a room type is available for a given date range.
   */
  static async checkAvailability(roomTypeId: string, checkIn: Date, checkOut: Date, safetyMargin = 1) {
    const start = startOfDay(checkIn);
    const end = startOfDay(checkOut);
    const days = differenceInDays(end, start);

    const availabilityRef = collection(db, 'availability');
    const q = query(
      availabilityRef,
      where('roomTypeId', '==', roomTypeId),
      where('date', '>=', Timestamp.fromDate(start)),
      where('date', '<', Timestamp.fromDate(end))
    );

    const snapshot = await getDocs(q);
    const availability = snapshot.docs.map(doc => doc.data() as IAvailability);

    if (availability.length < days) {
      return { available: false, reason: 'Dates not initialized' };
    }

    for (const day of availability) {
      const realAvailable = day.total - day.booked - day.locked - safetyMargin;
      if (realAvailable <= 0) {
        return { available: false, reason: `Sold out on ${day.date.toDate().toDateString()}` };
      }
    }

    return { available: true };
  }

  /**
   * Updates availability records for a room type.
   */
  static async initializeAvailability(roomTypeId: string, startDate: Date, endDate: Date) {
    const roomTypeRef = doc(db, 'roomTypes', roomTypeId);
    const roomTypeSnap = await getDoc(roomTypeRef);
    if (!roomTypeSnap.exists()) throw new Error('Room type not found');
    const roomType = roomTypeSnap.data() as IRoomType;

    const start = startOfDay(startDate);
    const end = startOfDay(endDate);
    const days = differenceInDays(end, start);

    const batch = writeBatch(db);
    for (let i = 0; i < days; i++) {
      const date = addDays(start, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const availId = `${roomTypeId}_${dateStr}`;
      const availRef = doc(db, 'availability', availId);
      
      batch.set(availRef, {
        date: Timestamp.fromDate(date),
        roomTypeId,
        total: roomType.totalInventory,
        booked: 0,
        locked: 0,
        available: roomType.totalInventory
      }, { merge: true });
    }

    await batch.commit();
  }
}

export class BookingService {
  /**
   * Creates a temporary lock for 10 minutes.
   */
  static async createLock(roomTypeId: string, checkIn: Date, checkOut: Date, sessionId: string) {
    return await runTransaction(db, async (transaction) => {
      const { available, reason } = await AvailabilityService.checkAvailability(roomTypeId, checkIn, checkOut);
      if (!available) throw new Error(reason);

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const lockRef = doc(collection(db, 'locks'));
      
      transaction.set(lockRef, {
        roomTypeId,
        checkIn: Timestamp.fromDate(checkIn),
        checkOut: Timestamp.fromDate(checkOut),
        expiresAt: Timestamp.fromDate(expiresAt),
        sessionId
      });

      // Update availability
      const start = startOfDay(checkIn);
      const end = startOfDay(checkOut);
      const days = differenceInDays(end, start);

      for (let i = 0; i < days; i++) {
        const date = addDays(start, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const availId = `${roomTypeId}_${dateStr}`;
        const availRef = doc(db, 'availability', availId);
        transaction.update(availRef, { locked: increment(1) });
      }

      return { id: lockRef.id };
    });
  }

  /**
   * Confirms a booking from a lock.
   */
  static async confirmBooking(lockId: string, guestInfo: any) {
    return await runTransaction(db, async (transaction) => {
      const lockRef = doc(db, 'locks', lockId);
      const lockSnap = await transaction.get(lockRef);
      if (!lockSnap.exists()) throw new Error('Lock expired or not found');
      const lock = lockSnap.data() as ILock;

      const roomTypeRef = doc(db, 'roomTypes', lock.roomTypeId);
      const roomTypeSnap = await transaction.get(roomTypeRef);
      if (!roomTypeSnap.exists()) throw new Error('Room type not found');
      const roomType = roomTypeSnap.data() as IRoomType;

      const bookingRef = doc(collection(db, 'bookings'));
      const nights = differenceInDays(lock.checkOut.toDate(), lock.checkIn.toDate());
      
      transaction.set(bookingRef, {
        source: 'website',
        checkIn: lock.checkIn,
        checkOut: lock.checkOut,
        roomTypeId: lock.roomTypeId,
        status: 'confirmed',
        guestInfo,
        totalAmount: roomType.price * nights,
        createdAt: Timestamp.now()
      });

      // Update availability: locked -1, booked +1
      const start = startOfDay(lock.checkIn.toDate());
      const end = startOfDay(lock.checkOut.toDate());
      const days = differenceInDays(end, start);

      for (let i = 0; i < days; i++) {
        const date = addDays(start, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const availId = `${lock.roomTypeId}_${dateStr}`;
        const availRef = doc(db, 'availability', availId);
        transaction.update(availRef, { 
          locked: increment(-1),
          booked: increment(1)
        });
      }

      transaction.delete(lockRef);
      return { id: bookingRef.id };
    });
  }
}

import { format } from 'date-fns';
