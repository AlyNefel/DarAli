import { NextResponse } from 'next/server';
import { BookingService } from '@/lib/services/booking';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomTypeId, checkIn, checkOut, sessionId } = body;

    if (!roomTypeId || !checkIn || !checkOut || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lock = await BookingService.createLock(
      roomTypeId,
      new Date(checkIn),
      new Date(checkOut),
      sessionId
    );

    return NextResponse.json(lock);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
