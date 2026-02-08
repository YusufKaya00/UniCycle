'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/lib/types';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersData = usersSnapshot.docs.map((docSnap) => ({
                uid: docSnap.id,
                ...docSnap.data(),
            })) as User[];

            // Sort by createdAt descending
            usersData.sort((a, b) => {
                const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
                const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
                return bTime - aTime;
            });

            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAdmin = async (userId: string, currentStatus: boolean) => {
        setUpdating(userId);
        try {
            await updateDoc(doc(db, 'users', userId), {
                isAdmin: !currentStatus,
            });
            setUsers(users.map(u =>
                u.uid === userId ? { ...u, isAdmin: !currentStatus } : u
            ));
        } catch (error) {
            console.error('Error updating admin status:', error);
            alert('Failed to update admin status');
        } finally {
            setUpdating(null);
        }
    };

    const filteredUsers = users.filter((user) => {
        const search = searchTerm.toLowerCase();
        return (
            user.email?.toLowerCase().includes(search) ||
            user.displayName?.toLowerCase().includes(search) ||
            user.university?.toLowerCase().includes(search)
        );
    });

    return (
        <AdminLayout>
            <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Users</h1>
                        <p className="text-muted">Manage all registered users</p>
                    </div>
                    <span className="badge badge-blue">{users.length} total</span>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, email, or university..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input max-w-md"
                    />
                </div>

                {/* Users Table */}
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">User</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Email</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">University</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Joined</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Admin</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4"><div className="h-10 w-40 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-32 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-24 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-20 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 w-12 skeleton rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-8 w-20 skeleton rounded"></div></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.uid} className="hover:bg-secondary/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {user.photoURL ? (
                                                        <img
                                                            src={user.photoURL}
                                                            alt={user.displayName || ''}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                                                            {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="font-medium">{user.displayName || 'No name'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted">{user.email}</td>
                                            <td className="px-6 py-4 text-sm">{user.university || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-muted">
                                                {user.createdAt?.toDate?.()?.toLocaleDateString() || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.isAdmin ? (
                                                    <span className="badge badge-green">Yes</span>
                                                ) : (
                                                    <span className="badge badge-gray">No</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleAdmin(user.uid, user.isAdmin)}
                                                    disabled={updating === user.uid}
                                                    className={`btn text-xs py-1.5 px-3 ${user.isAdmin ? 'btn-destructive' : 'btn-primary'
                                                        }`}
                                                >
                                                    {updating === user.uid ? (
                                                        '...'
                                                    ) : user.isAdmin ? (
                                                        'Remove Admin'
                                                    ) : (
                                                        'Make Admin'
                                                    )}
                                                </button>
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
