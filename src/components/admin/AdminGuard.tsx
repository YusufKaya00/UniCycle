'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center animate-pulse">
                        <span className="text-2xl">🔐</span>
                    </div>
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || !user.isAdmin) {
        return null;
    }

    return <>{children}</>;
}
