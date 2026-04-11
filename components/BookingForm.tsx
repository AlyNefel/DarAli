"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Users, Loader2, CheckCircle2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function BookingForm() {
  const { t } = useTranslation();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('1');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'search' | 'confirm' | 'success'>('search');
  const [lockId, setLockId] = useState('');
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetch('/api/availability')
      .then(res => res.json())
      .then(data => setRoomTypes(data))
      .catch(err => console.error('Failed to fetch room types', err));
  }, []);

  const handleLock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !roomTypeId) {
      toast.error('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const sessionId = Math.random().toString(36).substring(7);
      const res = await fetch('/api/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomTypeId,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          sessionId
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setLockId(data._id);
      setStep('confirm');
      toast.success('Room secured for 10 minutes. Please complete your details.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to secure room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lockId, guestInfo })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setStep('success');
      toast.success('Booking confirmed! Check your email for details.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm booking');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Reservation Confirmed!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for choosing Dar Ali. We have sent a confirmation email to <strong>{guestInfo.email}</strong>.
            </p>
            <Button onClick={() => window.location.reload()} className="rounded-full px-8 bg-gray-900">
              Return Home
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (step === 'confirm') {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 -mt-32 relative z-20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">Complete Your Reservation</h2>
            <form onSubmit={handleConfirm} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    required 
                    value={guestInfo.name} 
                    onChange={e => setGuestInfo({...guestInfo, name: e.target.value})}
                    placeholder="John Doe" 
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    required 
                    type="email" 
                    value={guestInfo.email} 
                    onChange={e => setGuestInfo({...guestInfo, email: e.target.value})}
                    placeholder="john@example.com" 
                    className="rounded-xl h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  value={guestInfo.phone} 
                  onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})}
                  placeholder="+1 (555) 000-0000" 
                  className="rounded-xl h-12"
                />
              </div>
              <div className="pt-4 flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep('search')}
                  className="flex-1 h-14 rounded-full"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 h-14 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-lg font-medium"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reservation" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 -mt-32 relative z-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">{t('reservation')}</h2>
            <p className="text-gray-500">{t('description')}</p>
          </div>

          <form onSubmit={handleLock} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-gray-500">{t('check_in')}</Label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-start text-left font-normal h-12 rounded-xl border-gray-200 px-2.5 gap-1.5",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-gray-500">{t('check_out')}</Label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-start text-left font-normal h-12 rounded-xl border-gray-200 px-2.5 gap-1.5",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? format(checkOut, "PPP") : <span>Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    initialFocus
                    disabled={(date) => date <= (checkIn || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-gray-500">{t('guests')}</Label>
              <Select value={guests} onValueChange={(val) => val && setGuests(val)}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Guests" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                  <SelectItem value="4">4+ Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider font-semibold text-gray-500">{t('select_room')}</Label>
              <Select value={roomTypeId} onValueChange={(val) => val && setRoomTypeId(val)}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt._id} value={rt._id}>{rt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-4 mt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-lg font-medium transition-all"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : t('book_now')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
