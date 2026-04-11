import { NextResponse } from "next/server";

export async function GET() {
  // In a real app, you'd fetch from Booking.com API or iCal
  return NextResponse.json({ 
    status: "success", 
    message: "Synchronized with Booking.com",
    lastSync: new Date().toISOString(),
    updates: [
      { roomId: "room_1", status: "booked", source: "booking.com" }
    ]
  });
}
