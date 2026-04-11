import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    // Fetch all room types to map names
    const roomTypesRef = collection(db, 'roomTypes');
    const rtSnapshot = await getDocs(roomTypesRef);
    const roomTypeMap = rtSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data().name;
      return acc;
    }, {} as Record<string, string>);

    const bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        _id: doc.id, 
        ...data,
        roomTypeId: {
          _id: data.roomTypeId,
          name: roomTypeMap[data.roomTypeId] || 'Unknown'
        }
      };
    });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
