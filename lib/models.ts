import { Timestamp } from 'firebase/firestore';

// --- RoomType Model ---
export interface IRoomType {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  totalInventory: number;
  description: string;
  price: number;
  baseCapacity: number;
  maxCapacity: number;
  icalImportUrl?: string;
}

// --- Booking Model ---
export interface IBooking {
  id?: string;
  source: 'website' | 'booking' | 'manual';
  checkIn: Timestamp;
  checkOut: Timestamp;
  roomTypeId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'staying' | 'completed';
  guestInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  totalAmount: number;
  externalId?: string;
  createdAt: Timestamp;
}

// --- Availability Model ---
export interface IAvailability {
  id?: string;
  date: Timestamp;
  roomTypeId: string;
  total: number;
  booked: number;
  locked: number;
  available: number;
}

// --- Lock Model ---
export interface ILock {
  id?: string;
  roomTypeId: string;
  checkIn: Timestamp;
  checkOut: Timestamp;
  expiresAt: Timestamp;
  sessionId: string;
}

// --- Transaction Model ---
export interface ITransaction {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Timestamp;
  bookingId?: string;
}

// --- RoomMapping Model ---
export interface IRoomMapping {
  id?: string;
  internalRoomId: string;
  provider: string;
  externalRoomId?: string;
  icalUrl?: string;
}
