"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Maximize2, Wifi } from 'lucide-react';

interface RoomProps {
  key?: string | number;
  title: string;
  description: string;
  price: number;
  image: string;
  capacity: number;
  size: number;
}

export default function RoomCard({ title, description, price, image, capacity, size }: RoomProps) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900">
          ${price} / night
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-serif">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">{description}</p>
        <div className="flex items-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{capacity} Guests</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4" />
            <span>{size} m²</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span>Free Wifi</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full rounded-full py-6 bg-gray-900 hover:bg-gray-800 text-white">
          {t('book_now')}
        </Button>
      </CardFooter>
    </Card>
  );
}
