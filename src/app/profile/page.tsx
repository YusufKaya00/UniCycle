'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProfilePage() {
    const router = useRouter();
    const { user, firebaseUser, loading, signOut } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/login');
        return null;
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firebaseUser || !user) return;

        setIsUpdating(true);
        setMessage(null);

        try {
            // Update Firebase Auth profile
            await updateProfile(firebaseUser, { displayName });

            // Update Firestore user document
            await updateDoc(doc(db, 'users', user.uid), {
                displayName,
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !firebaseUser || !user) return;

        setIsUpdating(true);
        setMessage(null);

        try {
            // Upload to storage
            const storageRef = ref(storage, `avatars/${user.uid}`);
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);

            // Update Firebase Auth
            await updateProfile(firebaseUser, { photoURL });

            // Update Firestore
            await updateDoc(doc(db, 'users', user.uid), {
                photoURL,
            });

            setMessage({ type: 'success', text: 'Photo updated successfully!' });
            // Force refresh
            window.location.reload();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to upload photo' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

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
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-success'
                                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-destructive'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Profile Photo Section */}
                    <div className="card mb-6">
                        <h2 className="font-semibold mb-4">Profile Photo</h2>
                        <div className="flex items-center gap-6">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || 'Profile'}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                                    {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                                </div>
                            )}

                            <div>
                                <label className="btn btn-secondary cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        disabled={isUpdating}
                                    />
                                    {isUpdating ? 'Uploading...' : 'Change Photo'}
                                </label>
                                <p className="text-xs text-muted mt-2">JPG, PNG. Max 5MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Info Section */}
                    <form onSubmit={handleUpdateProfile} className="card mb-6">
                        <h2 className="font-semibold mb-4">Profile Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="input"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    className="input bg-secondary"
                                    disabled
                                />
                                <p className="text-xs text-muted mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">University</label>
                                <input
                                    type="text"
                                    value={user?.university || 'Riga Technical University'}
                                    className="input bg-secondary"
                                    disabled
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="btn btn-primary"
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>

                    {/* Account Actions */}
                    <div className="card">
                        <h2 className="font-semibold mb-4">Account</h2>
                        <button
                            onClick={handleSignOut}
                            className="btn btn-destructive"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
