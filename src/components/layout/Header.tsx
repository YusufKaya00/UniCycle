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
                    <div className="flex items-center justify-between h-18 sm:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-glow">
                                <span className="text-xl">🚴</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xl text-foreground tracking-tight leading-none">
                                    UniCycle
                                </span>
                                <span className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase leading-none mt-1">
                                    Marketplace
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-2">
                            <Link href="/listings" className="px-4 py-2 rounded-xl text-sm font-semibold text-muted hover:text-primary hover:bg-primary-light transition-all duration-200">
                                {t('nav.browse')}
                            </Link>
                            <Link href="/listings/new" className="px-4 py-2 rounded-xl text-sm font-semibold text-muted hover:text-primary hover:bg-primary-light transition-all duration-200">
                                {t('nav.sell')}
                            </Link>
                            {user && (
                                <Link href="/chat" className="px-4 py-2 rounded-xl text-sm font-semibold text-muted hover:text-primary hover:bg-primary-light transition-all duration-200">
                                    {t('nav.messages')}
                                </Link>
                            )}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block">
                                <LanguageSwitcher />
                            </div>

                            {user ? (
                                <>
                                    <Link href="/listings/new" className="btn btn-primary text-sm px-5 py-2.5 hidden lg:flex shadow-glow">
                                        <span>+</span> {t('nav.postItem')}
                                    </Link>
                                    <div className="relative group">
                                        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary transition-all duration-300 ring-2 ring-transparent group-hover:ring-primary/20">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName || 'User'}
                                                    className="w-9 h-9 rounded-full object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                                </div>
                                            )}
                                        </button>

                                        {/* Dropdown */}
                                        <div className="absolute right-0 top-full mt-3 w-64 bg-card border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                                            <div className="p-4 bg-secondary/50 border-b border-border">
                                                <p className="font-bold text-sm text-foreground truncate">{user.displayName || 'User'}</p>
                                                <p className="text-xs text-muted truncate mt-0.5">{user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-primary-light hover:text-primary transition-all duration-200">
                                                    <span className="text-lg">👤</span> {t('nav.myProfile')}
                                                </Link>
                                                <Link href="/my-listings" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-primary-light hover:text-primary transition-all duration-200">
                                                    <span className="text-lg">📦</span> {t('nav.myListings')}
                                                </Link>
                                                {user.isAdmin && (
                                                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-xl hover:bg-teal-50 text-teal-600 transition-all duration-200">
                                                        <span className="text-lg">🛡️</span> {t('nav.adminPanel')}
                                                    </Link>
                                                )}
                                                <div className="my-1 border-t border-border mx-2" />
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-destructive/10 text-destructive transition-all duration-200"
                                                >
                                                    <span className="text-lg">🚪</span> {t('nav.signOut')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="btn btn-ghost text-sm px-4 py-2 hover:bg-secondary">
                                        {t('nav.signIn')}
                                    </Link>
                                    <Link href="/register" className="btn btn-primary text-sm px-6 py-2.5 hidden sm:flex shadow-glow">
                                        {t('nav.getStarted')}
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2.5 rounded-xl bg-secondary text-foreground hover:bg-secondary-dark transition-all duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
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
