"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Bed, Wallet, Calendar } from 'lucide-react';

export default function AdminStats() {
  const [stats, setStats] = useState({
    revenue: 0,
    bookings: 0,
    occupancy: 0,
    guests: 0
  });

  const data = [
    { name: 'Mon', revenue: 4000, bookings: 24 },
    { name: 'Tue', revenue: 3000, bookings: 13 },
    { name: 'Wed', revenue: 2000, bookings: 98 },
    { name: 'Thu', revenue: 2780, bookings: 39 },
    { name: 'Fri', revenue: 1890, bookings: 48 },
    { name: 'Sat', revenue: 2390, bookings: 38 },
    { name: 'Sun', revenue: 3490, bookings: 43 },
  ];

  const COLORS = ['#111827', '#374151', '#6B7280', '#9CA3AF'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$24,500" icon={Wallet} trend="+12.5%" />
        <StatCard title="Total Bookings" value="156" icon={Calendar} trend="+8.2%" />
        <StatCard title="Occupancy Rate" value="84%" icon={Bed} trend="+4.1%" />
        <StatCard title="Total Guests" value="342" icon={Users} trend="+15.3%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Bookings Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#111827" strokeWidth={3} dot={{ r: 4, fill: '#111827' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-gray-50 rounded-2xl">
            <Icon size={24} className="text-gray-900" />
          </div>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{trend}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">{title}</p>
          <h4 className="text-2xl font-serif font-bold text-gray-900">{value}</h4>
        </div>
      </CardContent>
    </Card>
  );
}
