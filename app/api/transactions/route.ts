import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const transactions = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
