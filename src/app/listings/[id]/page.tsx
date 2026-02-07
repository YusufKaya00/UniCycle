'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocationDisplay from '@/components/maps/LocationDisplay';
import { Listing, Chat } from '@/lib/types';
import { CATEGORIES, CONDITIONS } from '@/lib/constants';
import { formatPrice, formatDate } from '@/lib/utils';

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isContactingLoading, setIsContactingLoading] = useState(false);

    const listingId = params.id as string;

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const docRef = doc(db, 'listings', listingId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
                }
            } catch (error) {
                console.error('Error fetching listing:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (listingId) {
            fetchListing();
        }
    }, [listingId]);

    const handleContact = async () => {
        if (!user || !listing) return;

        setIsContactingLoading(true);

        try {
            // Check if chat already exists
            const chatsQuery = query(
                collection(db, 'chats'),
                where('participants', 'array-contains', user.uid),
                where('listingId', '==', listingId)
            );
            const existingChats = await getDocs(chatsQuery);

            let chatId: string;

            if (!existingChats.empty) {
                // Chat exists, navigate to it
                chatId = existingChats.docs[0].id;
            } else {
                // Create new chat
                const chatData: Omit<Chat, 'id'> = {
                    participants: [user.uid, listing.userId],
                    participantNames: {
                        [user.uid]: user.displayName || user.email?.split('@')[0] || 'User',
                        [listing.userId]: listing.userDisplayName,
                    },
                    participantPhotos: {
                        [user.uid]: user.photoURL || null,
                        [listing.userId]: listing.userPhotoURL,
                    },
                    listingId: listingId,
                    listingTitle: listing.title,
                    lastMessage: '',
                    lastMessageAt: serverTimestamp() as any,
                    lastMessageSenderId: '',
                };

                const chatRef = await addDoc(collection(db, 'chats'), chatData);
                chatId = chatRef.id;
            }

            router.push(`/chat/${chatId}`);
        } catch (error) {
            console.error('Error creating/finding chat:', error);
        } finally {
            setIsContactingLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 py-8">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="aspect-square skeleton rounded-lg"></div>
                            <div className="space-y-4">
                                <div className="h-8 skeleton w-3/4"></div>
                                <div className="h-6 skeleton w-1/3"></div>
                                <div className="h-4 skeleton"></div>
                                <div className="h-4 skeleton"></div>
                                <div className="h-4 skeleton w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="text-6xl mb-4">😕</div>
                        <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
                        <p className="text-muted mb-4">This item may have been removed or doesn&apos;t exist.</p>
                        <Link href="/listings" className="btn btn-primary">
                            Browse Listings
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const category = CATEGORIES.find(c => c.id === listing.category);
    const condition = CONDITIONS.find(c => c.id === listing.condition);
    const isOwner = user?.uid === listing.userId;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6 text-sm text-muted">
                        <Link href="/" className="hover:text-foreground">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/listings" className="hover:text-foreground">Listings</Link>
                        <span className="mx-2">/</span>
                        <span className="text-foreground">{listing.title}</span>
                    </nav>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Images Section */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                                {listing.images && listing.images.length > 0 ? (
                                    <img
                                        src={listing.images[selectedImage]}
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                        {category?.icon || '📦'}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {listing.images && listing.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {listing.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index
                                                    ? 'border-primary'
                                                    : 'border-transparent hover:border-border'
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${listing.title} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="space-y-6">
                            {/* Status Badge */}
                            {listing.status !== 'active' && (
                                <div className={`inline-block badge ${listing.status === 'reserved' ? 'badge-yellow' : 'badge-gray'
                                    } text-sm`}>
                                    {listing.status === 'reserved' ? 'Reserved' : 'Sold'}
                                </div>
                            )}

                            {/* Title & Price */}
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                                    {listing.title}
                                </h1>
                                <div className={`text-3xl font-bold ${listing.price === 0 ? 'text-success' : 'text-primary'}`}>
                                    {formatPrice(listing.price)}
                                </div>
                            </div>

                            {/* Category & Condition */}
                            <div className="flex flex-wrap gap-2">
                                <span className="badge badge-blue">
                                    {category?.icon} {category?.name}
                                </span>
                                <span className="badge badge-gray">
                                    {condition?.name}
                                </span>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="font-semibold mb-2">Description</h2>
                                <p className="text-muted whitespace-pre-line">{listing.description}</p>
                            </div>

                            {/* Location */}
                            {listing.location && (
                                <div>
                                    <h2 className="font-semibold mb-2">Meeting Location</h2>
                                    <LocationDisplay location={listing.location} />
                                </div>
                            )}

                            {/* Seller Info */}
                            <div className="card">
                                <div className="flex items-center gap-3">
                                    {listing.userPhotoURL ? (
                                        <img
                                            src={listing.userPhotoURL}
                                            alt={listing.userDisplayName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                                            {(listing.userDisplayName || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium">{listing.userDisplayName}</p>
                                        <p className="text-sm text-muted">
                                            Posted {listing.createdAt && formatDate(listing.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {isOwner ? (
                                    <>
                                        <Link
                                            href={`/listings/${listingId}/edit`}
                                            className="btn btn-secondary w-full"
                                        >
                                            Edit Listing
                                        </Link>
                                        <Link href="/my-listings" className="btn btn-secondary w-full">
                                            View My Listings
                                        </Link>
                                    </>
                                ) : user ? (
                                    <button
                                        onClick={handleContact}
                                        disabled={isContactingLoading || listing.status !== 'active'}
                                        className="btn btn-primary w-full py-3"
                                    >
                                        {isContactingLoading ? 'Opening Chat...' : 'Contact Seller'}
                                    </button>
                                ) : (
                                    <Link href="/login" className="btn btn-primary w-full py-3">
                                        Sign In to Contact
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
