import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { IRoomType, IAvailability } from '@/lib/models';
import { AvailabilityService } from '@/lib/services/booking';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const roomTypeId = searchParams.get('roomTypeId');

    if (!checkIn || !checkOut) {
      // Return all room types if no dates provided
      const roomTypesRef = collection(db, 'roomTypes');
      const snapshot = await getDocs(roomTypesRef);
      const roomTypes = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
      return NextResponse.json(roomTypes);
    }

    if (roomTypeId) {
      const result = await AvailabilityService.checkAvailability(
        roomTypeId, 
        new Date(checkIn), 
        new Date(checkOut)
      );
      return NextResponse.json(result);
    }

    // Check all room types
    const roomTypesRef = collection(db, 'roomTypes');
    const rtSnapshot = await getDocs(roomTypesRef);
    const roomTypes = rtSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() } as unknown as IRoomType));

    const results = await Promise.all(roomTypes.map(async (rt) => {
      const { available } = await AvailabilityService.checkAvailability(
        rt._id!,
        new Date(checkIn),
        new Date(checkOut)
      );
      return { ...rt, available };
    }));

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
