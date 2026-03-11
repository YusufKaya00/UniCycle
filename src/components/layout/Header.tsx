'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const { user, signOut } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <>
            <header className="sticky top-0 z-50 header-glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                <span className="text-lg">🚴</span>
                            </div>
                            <span className="font-bold text-lg text-foreground tracking-tight hidden sm:block">
                                UniCycle
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/listings" className="px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-secondary transition-all">
                                {t('nav.browse')}
                            </Link>
                            <Link href="/listings/new" className="px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-secondary transition-all">
                                {t('nav.sell')}
                            </Link>
                            {user && (
                                <Link href="/chat" className="px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-secondary transition-all">
                                    {t('nav.messages')}
                                </Link>
                            )}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2.5">
                            <LanguageSwitcher />

                            {user ? (
                                <>
                                    <Link href="/listings/new" className="btn btn-primary text-xs px-4 py-2 hidden sm:flex">
                                        {t('nav.postItem')}
                                    </Link>
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary transition-colors">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName || 'User'}
                                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                                                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                                </div>
                                            )}
                                        </button>

                                        {/* Dropdown */}
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-slideDown">
                                            <div className="p-3 border-b border-border">
                                                <p className="font-semibold text-sm truncate">{user.displayName || 'User'}</p>
                                                <p className="text-xs text-muted truncate">{user.email}</p>
                                            </div>
                                            <div className="p-1.5">
                                                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors">
                                                    <span>👤</span> {t('nav.myProfile')}
                                                </Link>
                                                <Link href="/my-listings" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors">
                                                    <span>📋</span> {t('nav.myListings')}
                                                </Link>
                                                {user.isAdmin && (
                                                    <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-primary font-medium">
                                                        <span>🛡️</span> {t('nav.adminPanel')}
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 transition-colors text-destructive"
                                                >
                                                    <span>🚪</span> {t('nav.signOut')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="btn btn-secondary text-xs px-4 py-2">
                                        {t('nav.signIn')}
                                    </Link>
                                    <Link href="/register" className="btn btn-primary text-xs px-4 py-2 hidden sm:flex">
                                        {t('nav.getStarted')}
                                    </Link>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
                    <div className="mobile-menu">
                        <div className="flex items-center justify-between mb-6">
                            <span className="font-bold text-lg">UniCycle</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="flex flex-col gap-1">
                            <Link href="/listings" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                                {t('nav.browse')}
                            </Link>
                            <Link href="/listings/new" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                                {t('nav.sell')}
                            </Link>
                            {user && (
                                <Link href="/chat" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
                                    {t('nav.messages')}
                                </Link>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}
