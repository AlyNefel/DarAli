import { NextResponse } from 'next/server';
import { BookingService } from '@/lib/services/booking';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lockId, guestInfo } = body;

    if (!lockId || !guestInfo) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const booking = await BookingService.confirmBooking(lockId, guestInfo);

    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
