import { NextResponse } from 'next/server';
import { MappingService } from '@/lib/services/mapping';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { providers = ['booking'] } = await request.json();
    const result = await MappingService.verifyMappings(providers);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
