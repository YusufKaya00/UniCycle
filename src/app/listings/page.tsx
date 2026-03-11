'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/listings/ListingCard';
import { Listing } from '@/lib/types';
import { CATEGORIES, CONDITIONS, CategoryId } from '@/lib/constants';

function ListingsContent() {
    const searchParams = useSearchParams();
    const { t } = useLanguage();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
    const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && CATEGORIES.some(c => c.id === categoryParam)) {
            setSelectedCategory(categoryParam as CategoryId);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            try {
                const q = query(
                    collection(db, 'listings'),
                    where('status', '==', 'active')
                );
                const snapshot = await getDocs(q);

                let fetchedListings = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Listing[];

                fetchedListings.sort((a, b) => {
                    const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
                    const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
                    return bTime - aTime;
                });

                if (selectedCategory !== 'all') {
                    fetchedListings = fetchedListings.filter(l => l.category === selectedCategory);
                }

                if (priceFilter === 'free') {
                    fetchedListings = fetchedListings.filter(l => l.price === 0);
                } else if (priceFilter === 'paid') {
                    fetchedListings = fetchedListings.filter(l => l.price > 0);
                }

                if (searchTerm) {
                    const lowerSearch = searchTerm.toLowerCase();
                    fetchedListings = fetchedListings.filter(
                        l => l.title.toLowerCase().includes(lowerSearch) ||
                            l.description.toLowerCase().includes(lowerSearch)
                    );
                }

                if (sortBy === 'price-low') {
                    fetchedListings.sort((a, b) => a.price - b.price);
                } else if (sortBy === 'price-high') {
                    fetchedListings.sort((a, b) => b.price - a.price);
                }

                setListings(fetchedListings);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, [selectedCategory, priceFilter, sortBy, searchTerm]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{t('listings.title')}</h1>
                        <p className="text-muted">{t('listings.subtitle')}</p>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-white border border-border rounded-2xl p-5 mb-6 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-3">
                            {/* Search */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder={t('listings.searchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="w-full lg:w-48">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
                                    className="input"
                                >
                                    <option value="all">{t('listings.allCategories')}</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Filter */}
                            <div className="w-full lg:w-36">
                                <select
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
                                    className="input"
                                >
                                    <option value="all">{t('listings.allPrices')}</option>
                                    <option value="free">{t('listings.freeOnly')}</option>
                                    <option value="paid">{t('listings.paidOnly')}</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="w-full lg:w-40">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-low' | 'price-high')}
                                    className="input"
                                >
                                    <option value="newest">{t('listings.newest')}</option>
                                    <option value="price-low">{t('listings.priceLow')}</option>
                                    <option value="price-high">{t('listings.priceHigh')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-white text-muted border border-border hover:border-primary/30 hover:text-foreground'
                                }`}
                        >
                            {t('listings.all')}
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-white text-muted border border-border hover:border-primary/30 hover:text-foreground'
                                    }`}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <p className="text-sm text-muted mb-4">
                        {isLoading ? t('listings.loading') : `${listings.length} ${listings.length === 1 ? 'item' : 'items'} found`}
                    </p>

                    {/* Listings Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="card">
                                    <div className="aspect-square skeleton mb-3"></div>
                                    <div className="h-4 skeleton mb-2 w-1/3"></div>
                                    <div className="h-5 skeleton mb-2"></div>
                                    <div className="h-4 skeleton w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : listings.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {listings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold mb-2">{t('listings.noItems')}</h3>
                            <p className="text-muted mb-6">{t('listings.tryAdjusting')}</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setPriceFilter('all');
                                }}
                                className="btn btn-secondary"
                            >
                                {t('listings.clearFilters')}
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ListingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="h-8 w-48 skeleton rounded mb-4"></div>
                        <div className="h-4 w-64 skeleton rounded mb-8"></div>
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
                    </div>
                </main>
                <Footer />
            </div>
        }>
            <ListingsContent />
        </Suspense>
    );
}
