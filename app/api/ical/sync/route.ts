import { NextResponse } from 'next/server';
import { ICalService } from '@/lib/services/ical';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { provider = 'booking' } = await request.json();
    const results = await ICalService.syncAllMappings(provider);
    return NextResponse.json({ message: 'Sync completed', results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
