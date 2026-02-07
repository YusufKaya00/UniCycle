# 🚴 UniCycle - University Marketplace

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.9-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

**A peer-to-peer marketplace for RTU (Riga Technical University) students to buy, sell, and donate second-hand items.**

[Live Demo](#) · [Features](#features) · [Tech Stack](#technology-stack) · [Installation](#installation)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [SWOT Analysis](#swot-analysis)
- [PESTLE Analysis](#pestle-analysis)
- [Porter's Five Forces](#porters-five-forces)
- [Future Roadmap](#future-roadmap)

---

## 📖 About

**UniCycle** is a sustainable, university-focused marketplace designed specifically for RTU students. The platform enables students to give their items a second life by connecting sellers and buyers within a trusted university community.

### Key Objectives
- 🌱 **Sustainability**: Reduce waste by promoting item reuse
- 🔒 **Security**: University email verification ensures trusted users
- 💰 **Affordability**: Help students save money on essential items
- 🤝 **Community**: Build connections within the university

---

## ✨ Features

### Core Features
| Feature | Description |
|---------|-------------|
| 🔐 **University Authentication** | Google Sign-In with `@edu.rtu.lv` email validation |
| 📝 **Item Listings** | Create listings with multiple images, descriptions, and pricing |
| 🗺️ **Google Maps Integration** | Select and display meeting points on campus |
| 💬 **Real-time Messaging** | In-app chat system for buyer-seller communication |
| 🔍 **Advanced Search & Filters** | Filter by category, price, condition, and keywords |
| 👤 **User Profiles** | Manage profile, view own listings, track status |

### Categories
- 💻 Electronics (heaters, fans, chargers)
- 🧹 Clean (cleaning supplies)
- 🍳 Cooking (kitchen items)
- 🛏️ Home Things (furniture, decor)
- 🎒 Personal Needs (clothing, accessories)
- 📦 Others

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router |
| **React** | 19.0 | UI component library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.x | Utility-first CSS framework |

### Backend & Services
| Technology | Version | Purpose |
|------------|---------|---------|
| **Firebase Auth** | 12.9 | User authentication (Google, Email/Password) |
| **Cloud Firestore** | 12.9 | NoSQL real-time database |
| **Firebase Storage** | 12.9 | Image upload and hosting |
| **Firebase Hosting** | - | Production deployment |

### APIs & Integrations
| Technology | Purpose |
|------------|---------|
| **Google Maps JavaScript API** | Interactive maps for location selection |
| **Google Geocoding API** | Address lookup and reverse geocoding |
| **Google Places API** | Location search functionality |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and quality |
| **Turbopack** | Fast development bundler |
| **Git/GitHub** | Version control |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │   React     │  │   Tailwind CSS      │  │
│  │  App Router │  │ Components  │  │   Styling           │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘  │
└─────────┼────────────────┼──────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                     FIREBASE SERVICES                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Auth     │  │  Firestore  │  │     Storage         │  │
│  │  (Google)   │  │  (NoSQL DB) │  │   (Images)          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE CLOUD APIS                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Maps API   │  │  Geocoding  │  │    Places API       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Models

**Users Collection**
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  university: string;
  createdAt: Timestamp;
  isAdmin: boolean;
}
```

**Listings Collection**
```typescript
{
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  condition: ConditionId;
  price: number;
  images: string[];
  location: { lat: number; lng: number; address: string };
  userId: string;
  status: 'active' | 'reserved' | 'sold';
  createdAt: Timestamp;
}
```

**Chats Collection**
```typescript
{
  id: string;
  participants: string[];
  listingId: string;
  lastMessage: string;
  lastMessageAt: Timestamp;
}
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account
- Google Cloud account (for Maps API)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YusufKaya00/UniCycle.git
cd UniCycle
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

4. **Firebase Console Setup**
- Enable Google Authentication
- Create Firestore Database
- Enable Storage

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Homepage
│   ├── login/               # Authentication
│   ├── register/
│   ├── listings/            # Browse & create listings
│   │   ├── page.tsx
│   │   ├── new/
│   │   └── [id]/
│   ├── chat/                # Messaging system
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── my-listings/         # User's listings
│   └── profile/             # User profile
├── components/
│   ├── layout/              # Header, Footer
│   ├── listings/            # ListingCard
│   └── maps/                # LocationPicker, LocationDisplay
├── hooks/
│   └── useAuth.tsx          # Authentication context
└── lib/
    ├── firebase.ts          # Firebase configuration
    ├── constants.ts         # App constants
    ├── types.ts             # TypeScript interfaces
    └── utils.ts             # Helper functions
```

---

## 📊 SWOT Analysis

### Strengths 💪
| Factor | Description |
|--------|-------------|
| **University Focus** | Targeted audience with verified `.edu.rtu.lv` emails ensures trust |
| **Real-time Features** | Firebase enables instant messaging and live updates |
| **Modern Tech Stack** | Next.js 16 + TypeScript provides excellent DX and performance |
| **Google Integration** | Maps API enhances UX for location-based meetups |
| **Mobile-First Design** | Responsive UI works on all devices |
| **Zero Backend Code** | Serverless architecture reduces maintenance |

### Weaknesses 📉
| Factor | Description |
|--------|-------------|
| **Limited Audience** | Only RTU students can use the platform |
| **Firebase Costs** | Usage-based pricing may increase with scale |
| **No Payment System** | Cash-only transactions limit convenience |
| **Single University** | Not scalable to other universities without modifications |
| **No Mobile App** | Web-only limits accessibility |

### Opportunities 🚀
| Factor | Description |
|--------|-------------|
| **Multi-University Expansion** | Expand to other Latvian/Baltic universities |
| **Payment Integration** | Add Stripe/PayPal for secure transactions |
| **Mobile App** | React Native app for better engagement |
| **Premium Features** | Featured listings, priority support |
| **Partnerships** | Collaborate with student organizations |
| **Sustainability Metrics** | Track environmental impact of reused items |

### Threats ⚠️
| Factor | Description |
|--------|-------------|
| **Competition** | Facebook Marketplace, SS.lv, local alternatives |
| **User Adoption** | Requires critical mass for network effect |
| **Security Risks** | Scams, fake listings, data breaches |
| **API Costs** | Google Maps API pricing changes |
| **University Policy** | Potential restrictions on campus commerce |

---

## 🌍 PESTLE Analysis

### Political
- EU regulations on digital marketplaces (DSA)
- University policies on student commerce
- Data protection requirements (GDPR)

### Economic
- Student budget constraints drive demand
- Inflation increases second-hand market appeal
- Firebase/Google Cloud pricing fluctuations

### Social
- Growing sustainability awareness among Gen Z
- Sharing economy popularity
- Campus community building trends

### Technological
- Firebase/Google Cloud reliability
- Mobile-first user expectations
- Real-time communication demands

### Legal
- GDPR compliance for user data
- Consumer protection laws for transactions
- University intellectual property considerations

### Environmental
- Promotes circular economy
- Reduces waste from discarded items
- Supports sustainability goals

---

## 🏭 Porter's Five Forces

### 1. Competitive Rivalry (Medium-High)
- **Competitors**: Facebook Marketplace, SS.lv, OLX
- **Differentiation**: University-specific trust and community

### 2. Threat of New Entrants (Medium)
- **Barriers**: Low technical barriers, but network effects protect incumbents
- **Our Advantage**: First-mover advantage in RTU market

### 3. Threat of Substitutes (High)
- **Substitutes**: Social media groups, direct peer sales, physical bulletin boards
- **Mitigation**: Superior UX, integrated messaging, map features

### 4. Bargaining Power of Buyers (High)
- **Factor**: Users can easily switch to alternatives
- **Strategy**: Build community loyalty, unique features

### 5. Bargaining Power of Suppliers (Low)
- **Factor**: Sellers need platform for visibility
- **Opportunity**: Platform commission potential

---

## 🗺️ Future Roadmap

### Phase 1: Core Improvements ✅
- [x] Basic listing CRUD
- [x] User authentication
- [x] Real-time messaging
- [x] Google Maps integration

### Phase 2: Enhanced Features (Q2 2026)
- [ ] Push notifications
- [ ] Image compression/optimization
- [ ] Saved listings/favorites
- [ ] User ratings and reviews
- [ ] Admin moderation panel

### Phase 3: Expansion (Q3 2026)
- [ ] Multi-university support
- [ ] Payment integration (Stripe)
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

### Phase 4: Monetization (Q4 2026)
- [ ] Featured listings (paid)
- [ ] Premium seller accounts
- [ ] University partnerships

---

## 👥 Team

- **Developer**: Yusuf Kaya

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Made with ❤️ for RTU Students**

[⬆ Back to Top](#-unicycle---university-marketplace)

</div>
