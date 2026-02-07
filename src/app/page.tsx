'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/listings/ListingCard';
import { Listing } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';

export default function HomePage() {
  const { user, loading } = useAuth();
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  useEffect(() => {
    const fetchRecentListings = async () => {
      try {
        // Simple query to avoid composite index requirements
        const q = query(
          collection(db, 'listings'),
          where('status', '==', 'active')
        );
        const snapshot = await getDocs(q);
        let listings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Listing[];

        // Sort and limit client-side
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
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark mb-6 shadow-lg">
                <span className="text-4xl">🚴</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Give Your Items a{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Second Life
                </span>
              </h1>

              <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
                Buy, sell, or donate second-hand items within the RTU community.
                Sustainable, secure, and designed for students.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/listings" className="btn btn-primary text-base px-8 py-3">
                  Browse Items
                </Link>
                {!user && !loading && (
                  <Link href="/register" className="btn btn-secondary text-base px-8 py-3">
                    Join UniCycle
                  </Link>
                )}
                {user && (
                  <Link href="/listings/new" className="btn btn-secondary text-base px-8 py-3">
                    Sell an Item
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  href={`/listings?category=${category.id}`}
                  className="card text-center hover:border-primary/50 transition-colors group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Listings Section */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Recent Listings</h2>
              <Link href="/listings" className="text-primary hover:underline text-sm font-medium">
                View All →
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
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                <p className="text-muted mb-4">Be the first to post an item!</p>
                {user ? (
                  <Link href="/listings/new" className="btn btn-primary">
                    Post an Item
                  </Link>
                ) : (
                  <Link href="/register" className="btn btn-primary">
                    Join UniCycle
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                  📸
                </div>
                <h3 className="font-semibold text-lg mb-2">1. Post Your Item</h3>
                <p className="text-muted text-sm">
                  Take photos, add a description, set a price (or give it away for free), and choose a meeting point.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                  💬
                </div>
                <h3 className="font-semibold text-lg mb-2">2. Chat & Negotiate</h3>
                <p className="text-muted text-sm">
                  Connect with interested buyers through our in-app messaging. Discuss details and agree on a time.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                  🤝
                </div>
                <h3 className="font-semibold text-lg mb-2">3. Meet & Exchange</h3>
                <p className="text-muted text-sm">
                  Meet at the designated location on campus. Complete the handover safely.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && !loading && (
          <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Sign up with your RTU email and start buying, selling, or donating today.
              </p>
              <Link href="/register" className="btn bg-white text-primary hover:bg-white/90 px-8 py-3 text-base">
                Get Started Free
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div >
  );
}
