import { NextResponse } from 'next/server';
import { ICalService } from '@/lib/services/ical';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomTypeId: string }> }
) {
  try {
    const { roomTypeId } = await params;
    const icalData = await ICalService.exportToICal(roomTypeId);

    return new Response(icalData, {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': `attachment; filename="room-${roomTypeId}.ics"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
