// i18n Translation System for UniCycle
// Supports: English (en), Latvian (lv)

export type Language = 'en' | 'lv';

export const translations = {
  en: {
    // Header
    'nav.browse': 'Browse',
    'nav.sell': 'Sell Item',
    'nav.messages': 'Messages',
    'nav.postItem': '+ Post Item',
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    'nav.myProfile': 'My Profile',
    'nav.myListings': 'My Listings',
    'nav.adminPanel': 'Admin Panel',
    'nav.signOut': 'Sign Out',

    // Home - Hero
    'hero.title1': 'Give Your Items a ',
    'hero.titleHighlight': 'Second Life',
    'hero.subtitle': 'Buy, sell, or donate second-hand items within the RTU community. Sustainable, secure, and designed for students.',
    'hero.browseItems': 'Browse Items',
    'hero.joinUniCycle': 'Join UniCycle',
    'hero.sellItem': 'Sell an Item',

    // Home - Categories
    'categories.title': 'Browse by Category',

    // Home - Recent
    'recent.title': 'Recent Listings',
    'recent.viewAll': 'View All →',
    'recent.noListings': 'No listings yet',
    'recent.beFirst': 'Be the first to post an item!',
    'recent.postItem': 'Post an Item',

    // Home - How it works
    'howItWorks.title': 'How It Works',
    'howItWorks.step1.title': '1. Post Your Item',
    'howItWorks.step1.desc': 'Take photos, add a description, set a price (or give it away for free), and choose a meeting point.',
    'howItWorks.step2.title': '2. Chat & Negotiate',
    'howItWorks.step2.desc': 'Connect with interested buyers through our in-app messaging. Discuss details and agree on a time.',
    'howItWorks.step3.title': '3. Meet & Exchange',
    'howItWorks.step3.desc': 'Meet at the designated location on campus. Complete the handover safely.',

    // Home - CTA
    'cta.title': 'Ready to Join?',
    'cta.subtitle': 'Sign up with your RTU email and start buying, selling, or donating today.',
    'cta.button': 'Get Started Free',

    // Home - Stats
    'stats.sustainable': 'Sustainable',
    'stats.sustainableDesc': 'Reduce waste by reusing',
    'stats.secure': 'Secure',
    'stats.secureDesc': 'RTU email verified',
    'stats.free': 'Free to Use',
    'stats.freeDesc': 'No hidden fees',

    // Login
    'login.title': 'UniCycle',
    'login.subtitle': 'University Marketplace',
    'login.heading': 'Sign In',
    'login.googleBtn': 'Continue with Google',
    'login.orEmail': 'or continue with email',
    'login.emailLabel': 'University Email',
    'login.passwordLabel': 'Password',
    'login.passwordPlaceholder': 'Enter your password',
    'login.submitBtn': 'Sign In',
    'login.submitting': 'Signing in...',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign Up',
    'login.footer': 'Only @{domain} email addresses are allowed',
    'login.dismiss': 'Dismiss',

    // Register
    'register.subtitle': 'Join the University Marketplace',
    'register.heading': 'Create Account',
    'register.googleBtn': 'Continue with Google',
    'register.orEmail': 'or register with email',
    'register.nameLabel': 'Full Name',
    'register.namePlaceholder': 'Enter your full name',
    'register.emailLabel': 'University Email',
    'register.passwordLabel': 'Password',
    'register.passwordPlaceholder': 'Create a password (min 6 characters)',
    'register.confirmLabel': 'Confirm Password',
    'register.confirmPlaceholder': 'Confirm your password',
    'register.submitBtn': 'Create Account',
    'register.submitting': 'Creating account...',
    'register.hasAccount': 'Already have an account?',
    'register.signIn': 'Sign In',
    'register.passwordMismatch': 'Passwords do not match',
    'register.passwordShort': 'Password must be at least 6 characters',

    // Listings
    'listings.title': 'Browse Items',
    'listings.subtitle': 'Find what you need from the RTU community',
    'listings.searchPlaceholder': 'Search items...',
    'listings.allCategories': 'All Categories',
    'listings.allPrices': 'All Prices',
    'listings.freeOnly': 'Free Only',
    'listings.paidOnly': 'Paid Only',
    'listings.newest': 'Newest First',
    'listings.priceLow': 'Price: Low to High',
    'listings.priceHigh': 'Price: High to Low',
    'listings.all': 'All',
    'listings.loading': 'Loading...',
    'listings.itemsFound': '{count} item{s} found',
    'listings.noItems': 'No items found',
    'listings.tryAdjusting': 'Try adjusting your search or filters',
    'listings.clearFilters': 'Clear Filters',

    // ListingCard
    'card.free': 'Free',
    'card.reserved': 'Reserved',
    'card.sold': 'Sold',

    // Footer
    'footer.tagline': 'Sustainable Student Marketplace',
    'footer.about': 'About',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.contact': 'Contact',
    'footer.copyright': '© {year} UniCycle. RTU Students.',

    // General
    'loading': 'Loading...',
  },
  lv: {
    // Header
    'nav.browse': 'Pārlūkot',
    'nav.sell': 'Pārdot',
    'nav.messages': 'Ziņas',
    'nav.postItem': '+ Ievietot',
    'nav.signIn': 'Ieiet',
    'nav.getStarted': 'Sākt',
    'nav.myProfile': 'Mans Profils',
    'nav.myListings': 'Mani Sludinājumi',
    'nav.adminPanel': 'Admins',
    'nav.signOut': 'Iziet',

    // Home - Hero
    'hero.title1': 'Dodiet savām lietām ',
    'hero.titleHighlight': 'Otro Dzīvi',
    'hero.subtitle': 'Pērciet, pārdodiet vai ziedojiet lietotas lietas RTU kopienā. Ilgtspējīgi, droši un radīti studentiem.',
    'hero.browseItems': 'Pārlūkot Lietas',
    'hero.joinUniCycle': 'Pievienoties',
    'hero.sellItem': 'Pārdot Lietu',

    // Home - Categories
    'categories.title': 'Pārlūkot pēc Kategorijas',

    // Home - Recent
    'recent.title': 'Jaunākie Sludinājumi',
    'recent.viewAll': 'Skatīt Visus →',
    'recent.noListings': 'Pagaidām nav sludinājumu',
    'recent.beFirst': 'Esi pirmais, kas ievieto lietu!',
    'recent.postItem': 'Ievietot Lietu',

    // Home - How it works
    'howItWorks.title': 'Kā Tas Darbojas',
    'howItWorks.step1.title': '1. Ievieto Lietu',
    'howItWorks.step1.desc': 'Uzņem fotoattēlus, pievieno aprakstu, nosaki cenu (vai atdod par brīvu) un izvēlies tikšanās vietu.',
    'howItWorks.step2.title': '2. Sazinies',
    'howItWorks.step2.desc': 'Sazinies ar interesentiem, izmantojot mūsu ziņojumapmaiņu. Pārrunā detaļas un vienojies par laiku.',
    'howItWorks.step3.title': '3. Satiecies un Apmainies',
    'howItWorks.step3.desc': 'Satiecies norādītajā vietā universitātē. Droši veic nodošanu.',

    // Home - CTA
    'cta.title': 'Gatavs Pievienoties?',
    'cta.subtitle': 'Reģistrējies ar savu RTU e-pastu un sāc pirkt, pārdot vai ziedot jau šodien.',
    'cta.button': 'Sākt Bez Maksas',

    // Home - Stats
    'stats.sustainable': 'Ilgtspējīgi',
    'stats.sustainableDesc': 'Samazini atkritumus',
    'stats.secure': 'Droši',
    'stats.secureDesc': 'RTU e-pasts verificēts',
    'stats.free': 'Bez Maksas',
    'stats.freeDesc': 'Nav slēptu maksu',

    // Login
    'login.title': 'UniCycle',
    'login.subtitle': 'Universitātes Tirgus',
    'login.heading': 'Ieiet',
    'login.googleBtn': 'Turpināt ar Google',
    'login.orEmail': 'vai turpināt ar e-pastu',
    'login.emailLabel': 'Universitātes E-pasts',
    'login.passwordLabel': 'Parole',
    'login.passwordPlaceholder': 'Ievadiet savu paroli',
    'login.submitBtn': 'Ieiet',
    'login.submitting': 'Ieejam...',
    'login.noAccount': 'Nav konta?',
    'login.signUp': 'Reģistrēties',
    'login.footer': 'Atļauti tikai @{domain} e-pasta adreses',
    'login.dismiss': 'Noraidīt',

    // Register
    'register.subtitle': 'Pievienojies Universitātes Tirgum',
    'register.heading': 'Izveidot Kontu',
    'register.googleBtn': 'Turpināt ar Google',
    'register.orEmail': 'vai reģistrēties ar e-pastu',
    'register.nameLabel': 'Pilns Vārds',
    'register.namePlaceholder': 'Ievadiet savu pilno vārdu',
    'register.emailLabel': 'Universitātes E-pasts',
    'register.passwordLabel': 'Parole',
    'register.passwordPlaceholder': 'Izveidojiet paroli (min 6 rakstzīmes)',
    'register.confirmLabel': 'Apstiprināt Paroli',
    'register.confirmPlaceholder': 'Apstipriniet savu paroli',
    'register.submitBtn': 'Izveidot Kontu',
    'register.submitting': 'Konta izveide...',
    'register.hasAccount': 'Jau ir konts?',
    'register.signIn': 'Ieiet',
    'register.passwordMismatch': 'Paroles nesakrīt',
    'register.passwordShort': 'Parolei jābūt vismaz 6 rakstzīmēm',

    // Listings
    'listings.title': 'Pārlūkot Lietas',
    'listings.subtitle': 'Atrodi vajadzīgo RTU kopienā',
    'listings.searchPlaceholder': 'Meklēt lietas...',
    'listings.allCategories': 'Visas Kategorijas',
    'listings.allPrices': 'Visas Cenas',
    'listings.freeOnly': 'Tikai Bezmaksas',
    'listings.paidOnly': 'Tikai Maksas',
    'listings.newest': 'Jaunākās Vispirms',
    'listings.priceLow': 'Cena: Zema uz Augstu',
    'listings.priceHigh': 'Cena: Augsta uz Zemu',
    'listings.all': 'Visas',
    'listings.loading': 'Ielādē...',
    'listings.itemsFound': '{count} lieta{s} atrasta{s}',
    'listings.noItems': 'Nekas nav atrasts',
    'listings.tryAdjusting': 'Mēģini mainīt meklēšanu vai filtrus',
    'listings.clearFilters': 'Notīrīt Filtrus',

    // ListingCard
    'card.free': 'Bezmaksas',
    'card.reserved': 'Rezervēts',
    'card.sold': 'Pārdots',

    // Footer
    'footer.tagline': 'Ilgtspējīgs Studentu Tirgus',
    'footer.about': 'Par Mums',
    'footer.privacy': 'Privātums',
    'footer.terms': 'Noteikumi',
    'footer.contact': 'Kontakti',
    'footer.copyright': '© {year} UniCycle. RTU Studenti.',

    // General
    'loading': 'Ielādē...',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
