'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Chat } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

export default function ChatsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Simple query to avoid composite index requirements
        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Chat[];

            // Sort client-side by lastMessageAt
            chatList.sort((a, b) => {
                const aTime = a.lastMessageAt?.toDate?.()?.getTime() || 0;
                const bTime = b.lastMessageAt?.toDate?.()?.getTime() || 0;
                return bTime - aTime;
            });

            setChats(chatList);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/login');
        return null;
    }

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
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-foreground mb-6">Messages</h1>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="card flex items-center gap-4">
                                    <div className="w-12 h-12 skeleton rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 skeleton w-1/3 mb-2"></div>
                                        <div className="h-3 skeleton w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : chats.length > 0 ? (
                        <div className="space-y-2">
                            {chats.map((chat) => {
                                const otherUserId = chat.participants.find(p => p !== user?.uid) || '';
                                const otherUserName = chat.participantNames[otherUserId] || 'User';
                                const otherUserPhoto = chat.participantPhotos[otherUserId];
                                const isUnread = chat.lastMessageSenderId && chat.lastMessageSenderId !== user?.uid;

                                return (
                                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                                        <div className={`card card-clickable flex items-center gap-4 ${isUnread ? 'border-primary/50' : ''}`}>
                                            {/* Avatar */}
                                            {otherUserPhoto ? (
                                                <img
                                                    src={otherUserPhoto}
                                                    alt={otherUserName}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                                                    {otherUserName[0].toUpperCase()}
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className={`font-medium truncate ${isUnread ? 'text-foreground' : ''}`}>
                                                        {otherUserName}
                                                    </p>
                                                    <span className="text-xs text-muted flex-shrink-0">
                                                        {chat.lastMessageAt && formatRelativeTime(chat.lastMessageAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted truncate">
                                                    {chat.listingTitle}
                                                </p>
                                                {chat.lastMessage && (
                                                    <p className={`text-sm truncate ${isUnread ? 'text-foreground font-medium' : 'text-muted'}`}>
                                                        {chat.lastMessage}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Unread indicator */}
                                            {isUnread && (
                                                <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">💬</div>
                            <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                            <p className="text-muted mb-4">
                                Contact a seller to start a conversation
                            </p>
                            <Link href="/listings" className="btn btn-primary">
                                Browse Listings
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
