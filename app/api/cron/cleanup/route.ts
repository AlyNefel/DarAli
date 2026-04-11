import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, Timestamp, doc, increment, writeBatch } from 'firebase/firestore';
import { ILock } from '@/lib/models';
import { format, startOfDay, differenceInDays, addDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const locksRef = collection(db, 'locks');
    const q = query(locksRef, where('expiresAt', '<', Timestamp.now()));
    const snapshot = await getDocs(q);

    const results = [];
    for (const lockDoc of snapshot.docs) {
      const lock = lockDoc.data() as ILock;
      
      // Release availability
      const start = startOfDay(lock.checkIn.toDate());
      const end = startOfDay(lock.checkOut.toDate());
      const days = differenceInDays(end, start);

      const batch = writeBatch(db);
      for (let i = 0; i < days; i++) {
        const date = addDays(start, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const availId = `${lock.roomTypeId}_${dateStr}`;
        const availRef = doc(db, 'availability', availId);
        batch.update(availRef, { locked: increment(-1) });
      }
      await batch.commit();

      await deleteDoc(lockDoc.ref);
      results.push(lockDoc.id);
    }

    return NextResponse.json({ message: 'Cleanup completed', deletedCount: results.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
