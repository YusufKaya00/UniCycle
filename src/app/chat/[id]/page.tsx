'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    doc, getDoc, collection, query, orderBy, onSnapshot,
    addDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Chat, Message } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

export default function ChatDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading } = useAuth();
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const chatId = params.id as string;

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch chat details
    useEffect(() => {
        const fetchChat = async () => {
            try {
                const chatDoc = await getDoc(doc(db, 'chats', chatId));
                if (chatDoc.exists()) {
                    setChat({ id: chatDoc.id, ...chatDoc.data() } as Chat);
                }
            } catch (error) {
                console.error('Error fetching chat:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (chatId) {
            fetchChat();
        }
    }, [chatId]);

    // Subscribe to messages
    useEffect(() => {
        if (!chatId) return;

        const q = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(messageList);
        });

        return () => unsubscribe();
    }, [chatId]);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/login');
        return null;
    }

    // Check if user is participant
    if (chat && user && !chat.participants.includes(user.uid)) {
        router.push('/chat');
        return null;
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !chat) return;

        const messageText = newMessage.trim();
        setNewMessage('');
        setIsSending(true);

        try {
            // Add message to subcollection
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
                senderId: user.uid,
                senderName: user.displayName || user.email?.split('@')[0] || 'User',
                text: messageText,
                createdAt: serverTimestamp(),
            });

            // Update chat with last message
            await updateDoc(doc(db, 'chats', chatId), {
                lastMessage: messageText,
                lastMessageAt: serverTimestamp(),
                lastMessageSenderId: user.uid,
            });
        } catch (error) {
            console.error('Error sending message:', error);
            setNewMessage(messageText); // Restore message on error
        } finally {
            setIsSending(false);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse text-primary text-xl">Loading...</div>
            </div>
        );
    }

    if (!chat) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">😕</div>
                        <h1 className="text-2xl font-bold mb-2">Chat Not Found</h1>
                        <Link href="/chat" className="btn btn-primary">
                            Back to Messages
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const otherUserId = chat.participants.find(p => p !== user?.uid) || '';
    const otherUserName = chat.participantNames[otherUserId] || 'User';
    const otherUserPhoto = chat.participantPhotos[otherUserId];

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Chat Header */}
            <header className="sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <Link href="/chat" className="text-muted hover:text-foreground">
                        ← Back
                    </Link>

                    <div className="flex items-center gap-3 flex-1">
                        {otherUserPhoto ? (
                            <img
                                src={otherUserPhoto}
                                alt={otherUserName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                                {otherUserName[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="font-medium">{otherUserName}</p>
                            <Link
                                href={`/listings/${chat.listingId}`}
                                className="text-xs text-muted hover:text-primary"
                            >
                                {chat.listingTitle}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto py-4">
                <div className="max-w-3xl mx-auto px-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-8 text-muted">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isOwn = message.senderId === user?.uid;
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${isOwn
                                                ? 'bg-primary text-white rounded-br-md'
                                                : 'bg-secondary text-foreground rounded-bl-md'
                                            }`}
                                    >
                                        <p className="break-words">{message.text}</p>
                                        <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-muted'}`}>
                                            {message.createdAt && formatRelativeTime(message.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Message Input */}
            <div className="sticky bottom-0 bg-card border-t border-border p-4">
                <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="input flex-1"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="btn btn-primary px-6"
                    >
                        {isSending ? '...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
}
