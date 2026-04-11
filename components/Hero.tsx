"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

import Image from 'next/image';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury Hotel"
          fill
          className="object-cover"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight"
        >
          {t('welcome')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/90 mb-10 font-light max-w-2xl mx-auto"
        >
          {t('description')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg rounded-full transition-all hover:scale-105">
            {t('book_now')}
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-8 py-6 text-lg rounded-full transition-all">
            {t('rooms')}
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60"
      >
        <div className="w-px h-12 bg-white/30 mx-auto" />
      </motion.div>
    </section>
  );
}
