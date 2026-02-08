'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Listing } from '@/lib/types';
import { CATEGORIES, CONDITIONS, STATUSES } from '@/lib/constants';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminListings() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const listingsSnapshot = await getDocs(collection(db, 'listings'));
            const listingsData = listingsSnapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            })) as Listing[];

            // Sort by createdAt descending
            listingsData.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
                const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
                return bTime - aTime;
            });

            setListings(listingsData);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (listingId: string, newStatus: string) => {
        setUpdating(listingId);
        try {
            await updateDoc(doc(db, 'listings', listingId), {
                status: newStatus,
                updatedAt: new Date(),
            });
            setListings(listings.map(l =>
                l.id === listingId ? { ...l, status: newStatus as any } : l
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const deleteListing = async (listingId: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        setUpdating(listingId);
        try {
            await deleteDoc(doc(db, 'listings', listingId));
            setListings(listings.filter(l => l.id !== listingId));
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Failed to delete listing');
        } finally {
            setUpdating(null);
        }
    };

    const getCategoryName = (categoryId: string) => {
        return CATEGORIES.find(c => c.id === categoryId)?.name || categoryId;
    };

    const getConditionName = (conditionId: string) => {
        return CONDITIONS.find(c => c.id === conditionId)?.name || conditionId;
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'active': return 'badge-green';
            case 'reserved': return 'badge-yellow';
            case 'sold': return 'badge-gray';
            default: return 'badge-gray';
        }
    };

    const filteredListings = listings.filter((listing) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            listing.title?.toLowerCase().includes(search) ||
            listing.description?.toLowerCase().includes(search) ||
            listing.userEmail?.toLowerCase().includes(search) ||
            listing.userDisplayName?.toLowerCase().includes(search);

        const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Listings</h1>
                        <p className="text-muted">Manage all marketplace listings</p>
                    </div>
                    <span className="badge badge-blue">{listings.length} total</span>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by title, description, or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input flex-1 min-w-[200px] max-w-md"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input w-auto"
                    >
                        <option value="all">All Status</option>
                        {STATUSES.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Listings Table */}
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Listing</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Category</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Price</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Seller</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Created</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4"><div className="h-12 w-48 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-20 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-32 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 w-16 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-20 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-8 w-32 skeleton rounded"></div></td>
                                        </tr>
                                    ))
                                ) : filteredListings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-muted">
                                            No listings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredListings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-secondary/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {listing.images?.[0] ? (
                                                        <img
                                                            src={listing.images[0]}
                                                            alt={listing.title}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-xl">
                                                            📦
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium line-clamp-1">{listing.title}</p>
                                                        <p className="text-xs text-muted">{getConditionName(listing.condition)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{getCategoryName(listing.category)}</td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {listing.price === 0 ? (
                                                    <span className="text-primary">Free</span>
                                                ) : (
                                                    `€${listing.price}`
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-sm font-medium">{listing.userDisplayName || 'Unknown'}</p>
                                                    <p className="text-xs text-muted">{listing.userEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={listing.status}
                                                    onChange={(e) => updateStatus(listing.id, e.target.value)}
                                                    disabled={updating === listing.id}
                                                    className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${getStatusBadgeClass(listing.status)}`}
                                                >
                                                    {STATUSES.map((status) => (
                                                        <option key={status.id} value={status.id}>
                                                            {status.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted">
                                                {listing.createdAt?.toDate?.()?.toLocaleDateString() || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`/listings/${listing.id}`}
                                                        target="_blank"
                                                        className="btn btn-secondary text-xs py-1.5 px-3"
                                                    >
                                                        View
                                                    </a>
                                                    <button
                                                        onClick={() => deleteListing(listing.id)}
                                                        disabled={updating === listing.id}
                                                        className="btn btn-destructive text-xs py-1.5 px-3"
                                                    >
                                                        {updating === listing.id ? '...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
