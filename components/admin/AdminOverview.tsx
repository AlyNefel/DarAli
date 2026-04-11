"use client";

import React from 'react';

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div className="bg-gray-900 text-white p-12 rounded-[3rem] relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-serif font-bold mb-4">Welcome back, Admin</h1>
          <p className="text-gray-400 max-w-md">Here's what's happening at Dar Ali today. You have 3 new bookings and 2 rooms requiring maintenance.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xl font-serif font-bold text-gray-900">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 font-bold">
                    {i === 1 ? 'BK' : i === 2 ? 'TX' : 'RM'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {i === 1 ? 'New Booking: Ali E.' : i === 2 ? 'Payment Received: $350' : 'Room 102 Maintenance'}
                    </h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">2 hours ago</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-400">DETAILS</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-8">
          <h3 className="text-xl font-serif font-bold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4">
            <button className="p-6 bg-white rounded-3xl border border-gray-100 text-left hover:border-gray-900 transition-all group shadow-sm">
              <h4 className="font-bold text-gray-900 group-hover:translate-x-1 transition-transform">Generate Monthly Report</h4>
              <p className="text-sm text-gray-500">Download PDF summary</p>
            </button>
            <button className="p-6 bg-white rounded-3xl border border-gray-100 text-left hover:border-gray-900 transition-all group shadow-sm">
              <h4 className="font-bold text-gray-900 group-hover:translate-x-1 transition-transform">Update Room Rates</h4>
              <p className="text-sm text-gray-500">Manage seasonal pricing</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
