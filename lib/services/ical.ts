import { IRoomType, IBooking, IRoomMapping } from '../models';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc,
  setDoc,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { format, startOfDay, differenceInDays, addDays } from 'date-fns';

export class ICalService {
  /**
   * Syncs all room types by their mappings for a given provider.
   */
  static async syncAllMappings(provider: string) {
    const mappingsRef = collection(db, 'roomMappings');
    const q = query(mappingsRef, where('provider', '==', provider));
    const snapshot = await getDocs(q);
    const mappings = snapshot.docs.map(doc => doc.data() as IRoomMapping);

    const results = [];
    for (const mapping of mappings) {
      if (mapping.icalUrl) {
        const imported = await this.importFromUrl(mapping.internalRoomId, mapping.icalUrl);
        results.push({ roomTypeId: mapping.internalRoomId, importedCount: imported.length });
      }
    }

    return results;
  }

  /**
   * Imports reservations from a Booking.com iCal URL.
   */
  static async importFromUrl(roomTypeId: string, url: string) {
    const ical = (await import('node-ical')).default;
    const events = await ical.fromURL(url);
    const roomTypeRef = doc(db, 'roomTypes', roomTypeId);
    const roomTypeSnap = await getDoc(roomTypeRef);
    if (!roomTypeSnap.exists()) throw new Error('Room type not found');

    const importedBookings = [];

    for (const k in events) {
      const event = events[k];
      if (!event || event.type !== 'VEVENT') continue;

      const externalId = event.uid;
      const checkIn = new Date(event.start as Date);
      const checkOut = new Date(event.end as Date);

      // Check if already imported
      const bookingRef = doc(db, 'bookings', externalId);
      const bookingSnap = await getDoc(bookingRef);
      if (bookingSnap.exists()) continue;

      // Create external booking
      const bookingData: IBooking = {
        source: 'booking',
        checkIn: Timestamp.fromDate(checkIn),
        checkOut: Timestamp.fromDate(checkOut),
        roomTypeId,
        status: 'confirmed',
        guestInfo: {
          name: 'Booking.com Guest',
          email: 'no-reply@booking.com'
        },
        totalAmount: 0,
        externalId,
        createdAt: Timestamp.now()
      };

      await setDoc(bookingRef, bookingData);
      
      // Update availability
      const start = startOfDay(checkIn);
      const end = startOfDay(checkOut);
      const days = differenceInDays(end, start);

      const batch = writeBatch(db);
      for (let i = 0; i < days; i++) {
        const date = addDays(start, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const availId = `${roomTypeId}_${dateStr}`;
        const availRef = doc(db, 'availability', availId);
        batch.update(availRef, { booked: increment(1) });
      }
      await batch.commit();

      importedBookings.push(bookingData);
    }

    return importedBookings;
  }

  /**
   * Generates an iCal feed for a specific room type.
   */
  static async exportToICal(roomTypeId: string) {
    const icalGen = (await import('ical-generator')).default;
    const roomTypeRef = doc(db, 'roomTypes', roomTypeId);
    const roomTypeSnap = await getDoc(roomTypeRef);
    if (!roomTypeSnap.exists()) throw new Error('Room type not found');
    const roomType = roomTypeSnap.data() as IRoomType;

    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('roomTypeId', '==', roomTypeId), where('status', 'in', ['confirmed', 'staying']));
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IBooking));

    const calendar = icalGen({ name: `Dar Ali - ${roomType.name}` });

    bookings.forEach(booking => {
      calendar.createEvent({
        start: booking.checkIn.toDate(),
        end: booking.checkOut.toDate(),
        summary: `Reservation ${booking.source}`,
        description: `Guest: ${booking.guestInfo.name}`
      });
    });

    return calendar.toString();
  }
}
