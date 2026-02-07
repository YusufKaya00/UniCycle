'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ALLOWED_EMAIL_DOMAIN } from '@/lib/constants';

export default function RegisterPage() {
    const router = useRouter();
    const { signInWithGoogle, signUpWithEmail, loading, error, clearError } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        try {
            setIsSubmitting(true);
            await signInWithGoogle();
            router.push('/');
        } catch (err) {
            // Error is handled in useAuth
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        try {
            setIsSubmitting(true);
            await signUpWithEmail(email, password, displayName);
            router.push('/');
        } catch (err) {
            // Error is handled in useAuth
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse text-primary text-xl">Loading...</div>
            </div>
        );
    }

    const displayError = localError || error;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8 animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark mb-4">
                        <span className="text-3xl">🚴</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">UniCycle</h1>
                    <p className="text-muted">Join the University Marketplace</p>
                </div>

                {/* Register Card */}
                <div className="card animate-slideUp">
                    <h2 className="text-xl font-semibold text-center mb-6">Create Account</h2>

                    {/* Error Message */}
                    {displayError && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-destructive text-sm">
                            {displayError}
                            <button
                                onClick={() => { clearError(); setLocalError(null); }}
                                className="ml-2 text-destructive hover:underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* Google Sign Up */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting}
                        className="btn btn-google w-full mb-4"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-card px-4 text-muted">or register with email</span>
                        </div>
                    </div>

                    {/* Email Sign Up Form */}
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                                Full Name
                            </label>
                            <input
                                id="displayName"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your full name"
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                University Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={`student@${ALLOWED_EMAIL_DOMAIN}`}
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password (min 6 characters)"
                                className="input"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                className="input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full"
                        >
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-muted mt-6">
                    Only @{ALLOWED_EMAIL_DOMAIN} email addresses are allowed
                </p>
            </div>
        </div>
    );
}
