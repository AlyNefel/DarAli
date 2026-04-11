import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body;
  
  console.log("Contact form submission:", { name, email, message });
  
  return NextResponse.json({ success: true, message: "Message received" });
}
