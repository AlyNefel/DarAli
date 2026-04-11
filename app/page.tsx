"use client";

import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RoomCard from '@/components/RoomCard';
import BookingForm from '@/components/BookingForm';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { Settings, Loader2 } from 'lucide-react';
import '@/lib/i18n'; // Import i18n configuration

const AdminDashboard = dynamic(() => import('@/components/AdminDashboard'), { 
  loading: () => <div className="h-screen flex items-center justify-center bg-gray-900 text-white"><Loader2 className="animate-spin h-12 w-12" /></div> 
});

export default function Home() {
  const { t, i18n } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set RTL for Arabic
  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language, mounted]);

  const rooms = [
    {
      title: t('luxury_suite'),
      description: "Our finest suite with panoramic city views and premium amenities.",
      price: 350,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
      capacity: 2,
      size: 65
    },
    {
      title: t('deluxe_room'),
      description: "Spacious and elegant room designed for ultimate comfort.",
      price: 220,
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
      capacity: 2,
      size: 45
    },
    {
      title: t('standard_room'),
      description: "Cozy and well-appointed room perfect for short stays.",
      price: 150,
      image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=800",
      capacity: 2,
      size: 30
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
      <Navbar />
      
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <main>
          <Hero />
          
          <BookingForm />

          <section id="rooms" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t('rooms')}</h2>
                <div className="w-20 h-1 bg-gray-900 mx-auto rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {rooms.map((room, index) => (
                  <RoomCard 
                    key={index} 
                    title={room.title} 
                    description={room.description} 
                    price={room.price} 
                    image={room.image} 
                    capacity={room.capacity} 
                    size={room.size} 
                  />
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="relative">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
                    <Image 
                      src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" 
                      alt="Hotel Interior" 
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white p-4 rounded-3xl shadow-xl hidden md:block">
                    <div className="relative w-full h-full">
                      <Image 
                        src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=400" 
                        alt="Pool" 
                        fill
                        className="object-cover rounded-2xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">{t('about')}</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Dar Ali is more than just a hotel; it's a sanctuary of luxury and peace. 
                    Located in the heart of the city, we combine traditional hospitality with modern elegance 
                    to provide our guests with an unforgettable experience.
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-3xl font-serif font-bold text-gray-900 mb-1">15+</h4>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Luxury Rooms</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-serif font-bold text-gray-900 mb-1">24/7</h4>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">Concierge Service</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ContactForm />
        </main>
      )}

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-serif font-bold tracking-tighter">DAR ALI</div>
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
            <div className="text-sm text-gray-500">
              {t('footer_text')}
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Toggle (Secret for Demo) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg border-gray-200"
          onClick={() => setIsAdmin(!isAdmin)}
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
