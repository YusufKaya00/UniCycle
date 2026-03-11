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

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-teal-400 mb-8 shadow-lg animate-float">
                <span className="text-4xl">🚴</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
                {t('hero.title1')}
                <span className="text-gradient">{t('hero.titleHighlight')}</span>
              </h1>

              <p className="text-lg text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/listings" className="btn btn-primary text-base px-8 py-3.5">
                  {t('hero.browseItems')}
                </Link>
                {!user && !loading && (
                  <Link href="/register" className="btn btn-secondary text-base px-8 py-3.5">
                    {t('hero.joinUniCycle')}
                  </Link>
                )}
                {user && (
                  <Link href="/listings/new" className="btn btn-secondary text-base px-8 py-3.5">
                    {t('hero.sellItem')}
                  </Link>
                )}
              </div>
            </div>

            {/* Stats Strip */}
            <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto animate-slideUp">
              {[
                { icon: '🌱', title: t('stats.sustainable'), desc: t('stats.sustainableDesc') },
                { icon: '🔒', title: t('stats.secure'), desc: t('stats.secureDesc') },
                { icon: '✨', title: t('stats.free'), desc: t('stats.freeDesc') },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-semibold text-sm text-foreground">{stat.title}</div>
                  <div className="text-xs text-muted">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-10 tracking-tight">{t('categories.title')}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/listings?category=${category.id}`}
                  className="group bg-white border border-border rounded-xl p-5 text-center hover:border-primary/40 hover:shadow-md transition-all duration-300 hover-lift"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-sm text-foreground">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Listings Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">{t('recent.title')}</h2>
              <Link href="/listings" className="text-primary hover:text-primary-dark text-sm font-semibold transition-colors">
                {t('recent.viewAll')}
              </Link>
            </div>

            {isLoadingListings ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="aspect-square skeleton mb-3"></div>
                    <div className="h-4 skeleton mb-2 w-1/3"></div>
                    <div className="h-5 skeleton mb-2"></div>
                    <div className="h-4 skeleton w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentListings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {recentListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">{t('recent.noListings')}</h3>
                <p className="text-muted mb-6">{t('recent.beFirst')}</p>
                {user ? (
                  <Link href="/listings/new" className="btn btn-primary">
                    {t('recent.postItem')}
                  </Link>
                ) : (
                  <Link href="/register" className="btn btn-primary">
                    {t('hero.joinUniCycle')}
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-14 tracking-tight">{t('howItWorks.title')}</h2>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                { icon: '📸', title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc') },
                { icon: '💬', title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc') },
                { icon: '🤝', title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc') },
              ].map((step, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-light flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 tracking-tight">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && !loading && (
          <section className="py-20 cta-gradient text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">{t('cta.title')}</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                {t('cta.subtitle')}
              </p>
              <Link href="/register" className="btn bg-white text-primary hover:bg-white/90 px-8 py-3.5 text-base font-semibold shadow-lg">
                {t('cta.button')}
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
