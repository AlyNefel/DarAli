"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRooms() {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/availability');
      const data = await res.json();
      setRoomTypes(data);
    } catch (error) {
      toast.error('Failed to fetch room types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room type?')) return;
    // Implementation for delete API would go here
    toast.info('Delete functionality would call DELETE /api/room-types/[id]');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search room types..." className="pl-10 rounded-full bg-white border-gray-200" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchRoomTypes} className="rounded-full gap-2">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
          <Button className="rounded-full bg-gray-900 gap-2">
            <Plus size={18} /> Add Room Type
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-8 py-4">Room Type</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>iCal Sync</TableHead>
                <TableHead className="text-right px-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomTypes.map((rt) => (
                <TableRow key={rt._id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="px-8 py-4">
                    <div>
                      <p className="font-bold text-gray-900">{rt.name}</p>
                      <p className="text-xs text-gray-500">{rt.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full font-normal">
                      {rt.totalInventory} Rooms
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">${rt.price}/night</TableCell>
                  <TableCell>
                    {rt.icalImportUrl ? (
                      <Badge className="bg-blue-100 text-blue-700 rounded-full border-none font-normal">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500 rounded-full border-none font-normal">
                        Not Configured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-900">
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(rt._id)}
                        className="h-8 w-8 rounded-full text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {roomTypes.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    No room types found. <Button variant="link" onClick={() => fetch('/api/seed')}>Seed Database</Button>
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
