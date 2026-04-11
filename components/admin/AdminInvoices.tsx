"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Printer, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminInvoices() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch invoices', error);
      }
    };
    fetchInvoices();
  }, []);

  const generateInvoice = (booking: any) => {
    toast.success(`Generating invoice for ${booking.guestName}...`);
    // In a real app, you'd use a library like jspdf or a server-side PDF generator
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by guest or invoice ID..." className="pl-10 rounded-full bg-white border-gray-200" />
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-8 py-4">Invoice ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right px-8">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="px-8 py-4 font-mono text-xs text-gray-500 uppercase">
                    INV-{booking.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">{booking.guestName}</TableCell>
                  <TableCell className="text-gray-500">
                    {booking.checkIn ? format(new Date(booking.checkIn), 'MMM dd, yyyy') : '...'}
                  </TableCell>
                  <TableCell className="font-medium">${booking.totalPrice || 0}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-full font-normal border-none",
                      booking.status === 'confirmed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {booking.status === 'confirmed' ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => generateInvoice(booking)}
                        className="rounded-full gap-2 text-gray-600 hover:text-gray-900"
                      >
                        <Printer size={16} /> Print
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-full gap-2 text-gray-600 hover:text-gray-900"
                      >
                        <Download size={16} /> PDF
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                    No bookings found to generate invoices
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

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
