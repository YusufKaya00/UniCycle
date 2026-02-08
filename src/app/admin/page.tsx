'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminLayout from '@/components/layout/AdminLayout';

interface Stats {
    totalUsers: number;
    totalListings: number;
    activeListings: number;
    reservedListings: number;
    soldListings: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalListings: 0,
        activeListings: 0,
        reservedListings: 0,
        soldListings: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch users count
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const totalUsers = usersSnapshot.size;

                // Fetch listings
                const listingsSnapshot = await getDocs(collection(db, 'listings'));
                const totalListings = listingsSnapshot.size;

                // Count by status
                let activeListings = 0;
                let reservedListings = 0;
                let soldListings = 0;

                listingsSnapshot.forEach((doc) => {
                    const data = doc.data();
                    switch (data.status) {
                        case 'active':
                            activeListings++;
                            break;
                        case 'reserved':
                            reservedListings++;
                            break;
                        case 'sold':
                            soldListings++;
                            break;
                    }
                });

                setStats({
                    totalUsers,
                    totalListings,
                    activeListings,
                    reservedListings,
                    soldListings,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-blue-500 to-blue-600' },
        { label: 'Total Listings', value: stats.totalListings, icon: '📦', color: 'from-purple-500 to-purple-600' },
        { label: 'Active Listings', value: stats.activeListings, icon: '✅', color: 'from-green-500 to-green-600' },
        { label: 'Reserved', value: stats.reservedListings, icon: '⏳', color: 'from-yellow-500 to-yellow-600' },
        { label: 'Sold', value: stats.soldListings, icon: '🎉', color: 'from-gray-500 to-gray-600' },
    ];

    return (
        <AdminLayout>
            <div className="animate-fadeIn">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted mb-8">Welcome to the UniCycle Admin Panel</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="card">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    {loading ? (
                                        <div className="h-8 w-12 skeleton rounded"></div>
                                    ) : (
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    )}
                                    <p className="text-sm text-muted">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                        <a href="/admin/users" className="btn btn-secondary">
                            👥 Manage Users
                        </a>
                        <a href="/admin/listings" className="btn btn-secondary">
                            📦 Manage Listings
                        </a>
                        <a href="/" className="btn btn-secondary">
                            🏠 View Site
                        </a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
