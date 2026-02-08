'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminGuard from '@/components/admin/AdminGuard';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/listings', label: 'Listings', icon: '📦' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    return (
        <AdminGuard>
            <div className="min-h-screen flex bg-background">
                {/* Sidebar */}
                <aside className="w-64 bg-card border-r border-border flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-border">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-xl">🚴</span>
                            </div>
                            <div>
                                <span className="font-bold text-lg text-foreground">UniCycle</span>
                                <span className="block text-xs text-muted">Admin Panel</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                                    ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium'
                                                    : 'text-muted hover:bg-secondary hover:text-foreground'
                                                }`}
                                        >
                                            <span className="text-xl">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Info & Back Link */}
                    <div className="p-4 border-t border-border space-y-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
                        >
                            <span>←</span>
                            <span>Back to Site</span>
                        </Link>
                        {user && (
                            <div className="px-4 py-2">
                                <p className="text-sm font-medium truncate">{user.displayName || 'Admin'}</p>
                                <p className="text-xs text-muted truncate">{user.email}</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
