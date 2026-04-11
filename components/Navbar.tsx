"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: t('rooms'), href: '#rooms' },
    { name: t('reservation'), href: '#reservation' },
    { name: t('about'), href: '#about' },
    { name: t('contact'), href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-serif font-bold tracking-tighter text-gray-900">DAR ALI</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </a>
            ))}
            
            <div className="flex items-center space-x-2 ml-4 border-l pl-4 border-gray-200">
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('en')} className={i18n.language === 'en' ? 'bg-gray-100' : ''}>EN</Button>
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('fr')} className={i18n.language === 'fr' ? 'bg-gray-100' : ''}>FR</Button>
              <Button variant="ghost" size="sm" onClick={() => changeLanguage('ar')} className={i18n.language === 'ar' ? 'bg-gray-100' : ''}>AR</Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 flex items-center space-x-4 px-3">
                <Button variant="outline" size="sm" onClick={() => changeLanguage('en')}>EN</Button>
                <Button variant="outline" size="sm" onClick={() => changeLanguage('fr')}>FR</Button>
                <Button variant="outline" size="sm" onClick={() => changeLanguage('ar')}>AR</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
