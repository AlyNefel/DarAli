"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminAccounting() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/transactions');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        setTransactions(data);
        
        let totalIncome = 0;
        let totalExpenses = 0;
        data.forEach((tx: any) => {
          if (tx.type === 'income') totalIncome += tx.amount;
          else totalExpenses += tx.amount;
        });
        
        setIncome(totalIncome);
        setExpenses(totalExpenses);
        setBalance(totalIncome - totalExpenses);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceCard title="Total Balance" value={`$${balance.toLocaleString()}`} icon={Wallet} color="text-gray-900" />
        <FinanceCard title="Total Income" value={`$${income.toLocaleString()}`} icon={TrendingUp} color="text-green-600" />
        <FinanceCard title="Total Expenses" value={`$${expenses.toLocaleString()}`} icon={TrendingDown} color="text-red-600" />
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 pb-6">
          <div>
            <CardTitle className="text-xl font-serif">Financial Ledger</CardTitle>
            <p className="text-sm text-gray-500">Track all income and expenses</p>
          </div>
          <Button className="rounded-full bg-gray-900 gap-2">
            <Plus size={18} /> Add Transaction
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-8 py-4">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right px-8">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="px-8 py-4 text-gray-500">
                    {tx.date?.toDate ? format(tx.date.toDate(), 'MMM dd, yyyy') : '...'}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{tx.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full font-normal">{tx.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.type === 'income' ? (
                        <TrendingUp size={14} className="text-green-600" />
                      ) : (
                        <TrendingDown size={14} className="text-red-600" />
                      )}
                      <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {tx.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cn("text-right px-8 font-bold", tx.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    No transactions recorded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function FinanceCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-2xl">
            <Icon size={24} className={color} />
          </div>
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{title}</p>
        </div>
        <h4 className={cn("text-3xl font-serif font-bold", color)}>{value}</h4>
      </CardContent>
    </Card>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
