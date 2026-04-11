import { NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { AvailabilityService } from '@/lib/services/booking';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const roomTypesData = [
      {
        name: 'Luxury Suite',
        slug: 'luxury-suite',
        totalInventory: 5,
        price: 350,
        description: 'Our finest suite with panoramic city views.',
        baseCapacity: 2,
        maxCapacity: 2,
      },
      {
        name: 'Deluxe Room',
        slug: 'deluxe-room',
        totalInventory: 10,
        price: 220,
        description: 'Spacious and elegant room designed for comfort.',
        baseCapacity: 2,
        maxCapacity: 2,
      },
      {
        name: 'Standard Room',
        slug: 'standard-room',
        totalInventory: 5,
        price: 150,
        description: 'Cozy and well-appointed room perfect for short stays.',
        baseCapacity: 2,
        maxCapacity: 2,
      }
    ];

    const createdRoomTypes = [];
    for (const data of roomTypesData) {
      const rtRef = doc(db, 'roomTypes', data.slug);
      await setDoc(rtRef, data, { merge: true });
      
      // Initialize availability for the next 365 days
      await AvailabilityService.initializeAvailability(
        data.slug,
        new Date(),
        addDays(new Date(), 365)
      );
      
      createdRoomTypes.push({ id: data.slug, ...data });

      // Create mapping for Booking.com
      const mappingRef = doc(db, 'roomMappings', `booking_${data.slug}`);
      await setDoc(mappingRef, { 
        internalRoomId: data.slug, 
        provider: 'booking', 
        externalRoomId: `booking_${data.slug}`,
        icalUrl: `https://example.com/ical/${data.slug}`
      }, { merge: true });
    }

    return NextResponse.json({ message: 'Database seeded successfully', roomTypes: createdRoomTypes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
