"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactForm() {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">{t('contact')}</h2>
            <p className="text-gray-600 mb-10 text-lg">
              Have questions or special requests? Our team is here to help you plan your perfect stay at Dar Ali.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Address</h4>
                  <p className="text-gray-600">123 Luxury Avenue, City Center, Morocco</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Phone className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Phone</h4>
                  <p className="text-gray-600">+212 5XX XX XX XX</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Mail className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600">contact@darali.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 md:p-12 rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input id="name" placeholder="Your Name" className="h-12 rounded-xl border-gray-200" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input id="email" type="email" placeholder="your@email.com" className="h-12 rounded-xl border-gray-200" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t('message')}</Label>
                <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px] rounded-xl border-gray-200" required />
              </div>
              <Button type="submit" className="w-full h-14 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-medium">
                {t('send')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
