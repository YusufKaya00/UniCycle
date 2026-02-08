'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-xl">🚴</span>
                        </div>
                        <span className="font-bold text-xl text-foreground hidden sm:block">UniCycle</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/listings" className="text-muted hover:text-foreground transition-colors">
                            Browse
                        </Link>
                        <Link href="/listings/new" className="text-muted hover:text-foreground transition-colors">
                            Sell Item
                        </Link>
                        {user && (
                            <Link href="/chat" className="text-muted hover:text-foreground transition-colors">
                                Messages
                            </Link>
                        )}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <Link href="/listings/new" className="btn btn-primary hidden sm:flex">
                                    + Post Item
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary transition-colors">
                                        {user.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName || 'User'}
                                                className="w-8 h-8 rounded-full object-cover border-2 border-primary"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                                                {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                            </div>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="p-3 border-b border-border">
                                            <p className="font-medium text-sm truncate">{user.displayName || 'User'}</p>
                                            <p className="text-xs text-muted truncate">{user.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link href="/profile" className="block px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors">
                                                My Profile
                                            </Link>
                                            <Link href="/my-listings" className="block px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors">
                                                My Listings
                                            </Link>
                                            {user.isAdmin && (
                                                <Link href="/admin" className="block px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-primary font-medium">
                                                    🛡️ Admin Panel
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-destructive"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="btn btn-secondary">
                                    Sign In
                                </Link>
                                <Link href="/register" className="btn btn-primary hidden sm:flex">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
