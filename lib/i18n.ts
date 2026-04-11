import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Dar Ali",
      "rooms": "Our Rooms",
      "reservation": "Make a Reservation",
      "contact": "Contact Us",
      "about": "About Us",
      "book_now": "Book Now",
      "admin_dashboard": "Admin Dashboard",
      "facilities": "Facilities",
      "cleaning_products": "Cleaning Products",
      "inventory": "Inventory Management",
      "employee_access": "Employee Access",
      "sync_booking": "Sync with Booking.com",
      "name": "Name",
      "email": "Email",
      "message": "Message",
      "send": "Send",
      "check_in": "Check-in",
      "check_out": "Check-out",
      "guests": "Guests",
      "select_room": "Select Room",
      "luxury_suite": "Luxury Suite",
      "deluxe_room": "Deluxe Room",
      "standard_room": "Standard Room",
      "description": "Experience unparalleled hospitality in the heart of the city.",
      "footer_text": "© 2026 Dar Ali. All rights reserved."
    }
  },
  fr: {
    translation: {
      "welcome": "Bienvenue à Dar Ali",
      "rooms": "Nos Chambres",
      "reservation": "Faire une Réservation",
      "contact": "Contactez-nous",
      "about": "À Propos",
      "book_now": "Réserver Maintenant",
      "admin_dashboard": "Tableau de Bord Admin",
      "facilities": "Installations",
      "cleaning_products": "Produits de Nettoyage",
      "inventory": "Gestion des Stocks",
      "employee_access": "Accès Employés",
      "sync_booking": "Synchroniser avec Booking.com",
      "name": "Nom",
      "email": "Email",
      "message": "Message",
      "send": "Envoyer",
      "check_in": "Arrivée",
      "check_out": "Départ",
      "guests": "Invités",
      "select_room": "Choisir une Chambre",
      "luxury_suite": "Suite de Luxe",
      "deluxe_room": "Chambre Deluxe",
      "standard_room": "Chambre Standard",
      "description": "Découvrez une hospitalité inégalée au cœur de la ville.",
      "footer_text": "© 2026 Dar Ali. Tous droits réservés."
    }
  },
  ar: {
    translation: {
      "welcome": "مرحباً بكم في دار علي",
      "rooms": "غرفنا",
      "reservation": "قم بالحجز",
      "contact": "اتصل بنا",
      "about": "من نحن",
      "book_now": "احجز الآن",
      "admin_dashboard": "لوحة تحكم المسؤول",
      "facilities": "المرافق",
      "cleaning_products": "منتجات التنظيف",
      "inventory": "إدارة المخزون",
      "employee_access": "وصول الموظفين",
      "sync_booking": "مزامنة مع Booking.com",
      "name": "الاسم",
      "email": "البريد الإلكتروني",
      "message": "الرسالة",
      "send": "إرسال",
      "check_in": "تسجيل الوصول",
      "check_out": "تسجيل المغادرة",
      "guests": "الضيوف",
      "select_room": "اختر الغرفة",
      "luxury_suite": "جناح فاخر",
      "deluxe_room": "غرفة ديلوكس",
      "standard_room": "غرفة قياسية",
      "description": "استمتع بضيافة لا مثيل لها في قلب المدينة.",
      "footer_text": "© 2026 دار علي. جميع الحقوق محفوظة."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
