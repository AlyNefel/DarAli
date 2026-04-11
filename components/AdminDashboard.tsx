"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  Package, 
  Users, 
  BarChart3, 
  FileText, 
  Wallet, 
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

import dynamic from 'next/dynamic';

// Admin Sections (Dynamically Imported)
const AdminOverview = dynamic(() => import('./admin/AdminOverview'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });
const AdminRooms = dynamic(() => import('./admin/AdminRooms'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });
const AdminBookings = dynamic(() => import('./admin/AdminBookings'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });
const AdminInventory = dynamic(() => import('./admin/AdminInventory'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });
const AdminEmployees = dynamic(() => import('./admin/AdminEmployees'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });
const AdminStats = dynamic(() => import('./admin/AdminStats'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });
const AdminInvoices = dynamic(() => import('./admin/AdminInvoices'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });
const AdminAccounting = dynamic(() => import('./admin/AdminAccounting'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });
const AdminChat = dynamic(() => import('./admin/AdminChat'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });
const AdminMappings = dynamic(() => import('./admin/AdminMappings'), { loading: () => <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> });

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'mappings', label: 'Mappings', icon: Settings },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'accounting', label: 'Accounting', icon: Wallet },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
  ];

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/ical/sync', { method: 'POST', body: JSON.stringify({}) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success('Synchronized with Booking.com successfully');
    } catch (error: any) {
      toast.error(error.message || 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview': return <AdminOverview />;
      case 'rooms': return <AdminRooms />;
      case 'mappings': return <AdminMappings />;
      case 'bookings': return <AdminBookings />;
      case 'inventory': return <AdminInventory />;
      case 'employees': return <AdminEmployees />;
      case 'stats': return <AdminStats />;
      case 'invoices': return <AdminInvoices />;
      case 'accounting': return <AdminAccounting />;
      case 'chat': return <AdminChat />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-gray-900 text-white transition-all duration-300 flex flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && <span className="text-xl font-serif font-bold tracking-tighter">DAR ALI</span>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                activeSection === item.id 
                  ? "bg-white text-gray-900" 
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <item.icon size={20} className={cn(activeSection === item.id ? "text-gray-900" : "text-gray-400 group-hover:text-white")} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-3 py-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {activeSection.replace('-', ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSync} 
              disabled={isSyncing}
              className="rounded-full gap-2 border-gray-200"
            >
              {isSyncing ? <Loader2 className="animate-spin h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
              {isSyncing ? 'Syncing...' : 'Sync iCal'}
            </Button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">aliessoudani412@gmail.com</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-200 border border-gray-300 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
