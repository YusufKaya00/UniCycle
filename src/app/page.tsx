'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/listings/ListingCard';
import { Listing } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  useEffect(() => {
    const fetchRecentListings = async () => {
      try {
        const q = query(
          collection(db, 'listings'),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        let listings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Listing[];

        listings.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
          const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
          return bTime - aTime;
        });
        listings = listings.slice(0, 8);
        setRecentListings(listings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoadingListings(false);
      }
    };

    fetchRecentListings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 bg-mesh">
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 sm:pt-32 sm:pb-40 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[50%] bg-accent/5 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto animate-reveal">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {t('stats.secure')}
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground mb-8 tracking-tight leading-[1.05]">
                {t('hero.title1')}
                <span className="block text-gradient mt-2">{t('hero.titleHighlight')}</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/listings" className="btn btn-primary text-base px-10 py-4 shadow-xl">
                  {t('hero.browseItems')}
                </Link>
                {!user && !loading ? (
                  <Link href="/register" className="btn btn-secondary text-base px-10 py-4">
                    {t('hero.joinUniCycle')}
                  </Link>
                ) : (
                  <Link href="/listings/new" className="btn btn-secondary text-base px-10 py-4">
                    {t('hero.sellItem')}
                  </Link>
                )}
              </div>
            </div>

            {/* Features Strip */}
            <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: '🌱', title: t('stats.sustainable'), desc: t('stats.sustainableDesc'), color: 'bg-green-50 text-green-600' },
                { icon: '🔒', title: t('stats.secure'), desc: t('stats.secureDesc'), color: 'bg-blue-50 text-blue-600' },
                { icon: '✨', title: t('stats.free'), desc: t('stats.freeDesc'), color: 'bg-amber-50 text-amber-600' },
              ].map((stat, i) => (
                <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-card/40 backdrop-blur-md border border-white/40 shadow-sm animate-reveal" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                  <div className={`w-12 h-12 shrink-0 rounded-xl ${stat.color} flex items-center justify-center text-2xl shadow-sm`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="font-bold text-base text-foreground mb-1">{stat.title}</div>
                    <div className="text-sm text-muted leading-snug">{stat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-white/50 backdrop-blur-sm border-y border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">{t('categories.title')}</h2>
              <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/listings?category=${category.id}`}
                  className="group relative flex flex-col items-center p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover-lift overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                    <span className="text-6xl grayscale">{category.icon}</span>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-4xl mb-5 group-hover:scale-110 group-hover:bg-primary-light transition-all duration-500 shadow-sm">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors text-center">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Listings Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">{t('recent.title')}</h2>
                <p className="text-muted font-medium">{t('recent.subtitle') || 'Handpicked items just for you'}</p>
              </div>
              <Link href="/listings" className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300">
                {t('recent.viewAll')}
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {isLoadingListings ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card h-[400px] flex flex-col gap-4">
                    <div className="aspect-[4/3] skeleton rounded-xl" />
                    <div className="h-6 skeleton rounded-lg w-2/3" />
                    <div className="h-4 skeleton rounded-lg w-full" />
                    <div className="mt-auto h-10 skeleton rounded-lg w-full" />
                  </div>
                ))}
              </div>
            ) : recentListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recentListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-[2.5rem] border border-border/50 shadow-sm">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-secondary flex items-center justify-center text-5xl animate-float">📦</div>
                <h3 className="text-2xl font-bold mb-3">{t('recent.noListings')}</h3>
                <p className="text-muted mb-8 max-w-sm mx-auto">{t('recent.beFirst')}</p>
                {user ? (
                  <Link href="/listings/new" className="btn btn-primary px-8 py-3.5">
                    {t('recent.postItem')}
                  </Link>
                ) : (
                  <Link href="/register" className="btn btn-primary px-8 py-3.5">
                    {t('hero.joinUniCycle')}
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-card border-y border-border/40 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">{t('howItWorks.title')}</h2>
              <p className="text-muted font-medium">Getting started with UniCycle is simple and secure</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: '📸', title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc'), color: 'from-blue-500 to-cyan-400' },
                { icon: '💬', title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc'), color: 'from-primary to-teal-400' },
                { icon: '🤝', title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc'), color: 'from-accent to-indigo-400' },
              ].map((step, i) => (
                <div key={i} className="relative group p-8 rounded-3xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300">
                  <div className="absolute top-8 left-8 text-6xl font-black text-foreground/5 pointer-events-none">0{i + 1}</div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && !loading && (
          <section className="py-24 px-4">
            <div className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden relative shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-accent opacity-90" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:24px_24px]" />
              
              <div className="relative px-8 py-20 text-center text-white z-10">
                <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">{t('cta.title')}</h2>
                <p className="text-white/80 mb-12 max-w-xl mx-auto text-lg font-medium leading-relaxed">
                  {t('cta.subtitle')}
                </p>
                <Link href="/register" className="btn bg-white text-primary hover:bg-white/90 px-12 py-4 text-lg font-bold shadow-xl transform hover:scale-105 active:scale-95 transition-all">
                  {t('cta.button')}
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
