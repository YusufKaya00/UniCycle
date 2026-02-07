'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User as FirebaseUser,
    onAuthStateChanged,
    signInWithPopup,
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { User } from '@/lib/types';
import { isValidUniversityEmail, ALLOWED_EMAIL_DOMAIN } from '@/lib/constants';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                setFirebaseUser(fbUser);
                // Fetch user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
                if (userDoc.exists()) {
                    setUser({ uid: fbUser.uid, ...userDoc.data() } as User);
                } else {
                    // Create user document if it doesn't exist
                    const newUser: Omit<User, 'uid'> = {
                        email: fbUser.email || '',
                        displayName: fbUser.displayName || '',
                        photoURL: fbUser.photoURL || null,
                        university: 'Riga Technical University',
                        createdAt: serverTimestamp() as any,
                        isAdmin: false,
                    };
                    await setDoc(doc(db, 'users', fbUser.uid), newUser);
                    setUser({ uid: fbUser.uid, ...newUser } as User);
                }
            } else {
                setFirebaseUser(null);
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setError(null);
            const result = await signInWithPopup(auth, googleProvider);

            // Check if email is from allowed domain
            if (!result.user.email || !isValidUniversityEmail(result.user.email)) {
                await firebaseSignOut(auth);
                throw new Error(`Only @${ALLOWED_EMAIL_DOMAIN} email addresses are allowed.`);
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            setError(null);

            if (!isValidUniversityEmail(email)) {
                throw new Error(`Only @${ALLOWED_EMAIL_DOMAIN} email addresses are allowed.`);
            }

            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const signUpWithEmail = async (email: string, password: string, displayName: string) => {
        try {
            setError(null);

            if (!isValidUniversityEmail(email)) {
                throw new Error(`Only @${ALLOWED_EMAIL_DOMAIN} email addresses are allowed.`);
            }

            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName });
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{
            user,
            firebaseUser,
            loading,
            error,
            signInWithGoogle,
            signInWithEmail,
            signUpWithEmail,
            signOut,
            clearError,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
