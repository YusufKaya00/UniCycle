import { Timestamp } from 'firebase/firestore';
import { CategoryId, ConditionId, StatusId } from './constants';

// User type
export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    university: string;
    createdAt: Timestamp;
    isAdmin: boolean;
}

// Location type for Google Maps
export interface Location {
    lat: number;
    lng: number;
    address: string;
}

// Listing type
export interface Listing {
    id: string;
    title: string;
    description: string;
    category: CategoryId;
    condition: ConditionId;
    price: number; // 0 = free/donation
    images: string[];
    location: Location;
    userId: string;
    userEmail: string;
    userDisplayName: string;
    userPhotoURL: string | null;
    status: StatusId;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Chat type
export interface Chat {
    id: string;
    participants: string[];
    participantNames: { [uid: string]: string };
    participantPhotos: { [uid: string]: string | null };
    listingId: string;
    listingTitle: string;
    lastMessage: string;
    lastMessageAt: Timestamp;
    lastMessageSenderId: string;
}

// Message type
export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    createdAt: Timestamp;
}

// Form types for creating/editing listings
export interface ListingFormData {
    title: string;
    description: string;
    category: CategoryId;
    condition: ConditionId;
    price: number;
    images: File[];
    location: Location | null;
}
