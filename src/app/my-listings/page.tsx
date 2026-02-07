'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Listing } from '@/lib/types';
import { CATEGORIES, STATUSES, StatusId } from '@/lib/constants';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

export default function MyListingsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<StatusId | 'all'>('all');

    useEffect(() => {
        const fetchListings = async () => {
            if (!user) return;

            try {
                // Simple query to avoid composite index requirements
                const q = query(
                    collection(db, 'listings'),
                    where('userId', '==', user.uid)
                );
                const snapshot = await getDocs(q);
                let userListings = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Listing[];

                // Sort client-side
                userListings.sort((a, b) => {
                    const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
                    const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
                    return bTime - aTime;
                });

                setListings(userListings);
            } catch (error) {
                console.error('Error fetching listings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchListings();
        }
    }, [user]);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/login');
        return null;
    }

    const handleStatusChange = async (listingId: string, newStatus: StatusId) => {
        try {
            await updateDoc(doc(db, 'listings', listingId), {
                status: newStatus,
            });
            setListings(prev =>
                prev.map(l => l.id === listingId ? { ...l, status: newStatus } : l)
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (listing: Listing) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        try {
            // Delete images from storage
            for (const imageUrl of listing.images) {
                try {
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                } catch (e) {
                    // Image might not exist or URL is different
                    console.log('Could not delete image:', e);
                }
            }

            // Delete listing document
            await deleteDoc(doc(db, 'listings', listing.id));
            setListings(prev => prev.filter(l => l.id !== listing.id));
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    const filteredListings = filter === 'all'
        ? listings
        : listings.filter(l => l.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse text-primary text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-foreground">My Listings</h1>
                        <Link href="/listings/new" className="btn btn-primary">
                            + New Listing
                        </Link>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-secondary text-muted hover:bg-border'
                                }`}
                        >
                            All ({listings.length})
                        </button>
                        {STATUSES.map(status => {
                            const count = listings.filter(l => l.status === status.id).length;
                            return (
                                <button
                                    key={status.id}
                                    onClick={() => setFilter(status.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${filter === status.id
                                        ? 'bg-primary text-white'
                                        : 'bg-secondary text-muted hover:bg-border'
                                        }`}
                                >
                                    {status.name} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Listings */}
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="card flex gap-4">
                                    <div className="w-24 h-24 skeleton rounded-lg"></div>
                                    <div className="flex-1">
                                        <div className="h-5 skeleton w-1/2 mb-2"></div>
                                        <div className="h-4 skeleton w-1/4 mb-2"></div>
                                        <div className="h-4 skeleton w-1/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredListings.length > 0 ? (
                        <div className="space-y-4">
                            {filteredListings.map((listing) => {
                                const category = CATEGORIES.find(c => c.id === listing.category);

                                return (
                                    <div key={listing.id} className="card flex flex-col sm:flex-row gap-4">
                                        {/* Image */}
                                        <Link href={`/listings/${listing.id}`} className="flex-shrink-0">
                                            <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-secondary">
                                                {listing.images && listing.images.length > 0 ? (
                                                    <img
                                                        src={listing.images[0]}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                                        {category?.icon || '📦'}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <Link href={`/listings/${listing.id}`}>
                                                    <h3 className="font-semibold hover:text-primary truncate">
                                                        {listing.title}
                                                    </h3>
                                                </Link>
                                                <span className={`badge badge-${listing.status === 'active' ? 'green' :
                                                    listing.status === 'reserved' ? 'yellow' : 'gray'
                                                    } flex-shrink-0`}>
                                                    {STATUSES.find(s => s.id === listing.status)?.name}
                                                </span>
                                            </div>

                                            <p className={`font-bold ${listing.price === 0 ? 'text-success' : 'text-primary'}`}>
                                                {formatPrice(listing.price)}
                                            </p>

                                            <p className="text-sm text-muted">
                                                {category?.icon} {category?.name} • {listing.createdAt && formatRelativeTime(listing.createdAt)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                            <select
                                                value={listing.status}
                                                onChange={(e) => handleStatusChange(listing.id, e.target.value as StatusId)}
                                                className="input text-sm py-1"
                                            >
                                                {STATUSES.map(status => (
                                                    <option key={status.id} value={status.id}>
                                                        {status.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={() => handleDelete(listing)}
                                                className="btn btn-destructive text-sm py-1"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {filter === 'all' ? 'No listings yet' : `No ${filter} listings`}
                            </h3>
                            <p className="text-muted mb-4">
                                {filter === 'all' ? 'Start selling by creating your first listing!' : 'Try a different filter'}
                            </p>
                            {filter === 'all' && (
                                <Link href="/listings/new" className="btn btn-primary">
                                    Create Listing
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
