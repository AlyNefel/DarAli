"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search bookings..." className="pl-10 rounded-full bg-white border-gray-200" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchBookings} className="rounded-full gap-2">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
          <Button variant="outline" className="rounded-full gap-2">
            <Download size={18} /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-8 py-4">Guest</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right px-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="px-8 py-4">
                    <div>
                      <p className="font-bold text-gray-900">{booking.guestInfo.name}</p>
                      <p className="text-xs text-gray-500">{booking.guestInfo.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd')}</p>
                      <p className="text-xs text-gray-400">{differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{booking.roomTypeId?.name || 'Unknown'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "rounded-full font-normal",
                      booking.source === 'booking' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-600 border-gray-100"
                    )}>
                      {booking.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-full font-normal border-none",
                      booking.status === 'confirmed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <ExternalLink size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                    No bookings found.
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
