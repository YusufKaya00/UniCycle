'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocationPicker from '@/components/maps/LocationPicker';
import { CATEGORIES, CONDITIONS, CategoryId, ConditionId } from '@/lib/constants';
import { Location } from '@/lib/types';

export default function NewListingPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<CategoryId>('other');
    const [condition, setCondition] = useState<ConditionId>('good');
    const [price, setPrice] = useState<number>(0);
    const [isFree, setIsFree] = useState(false);
    const [location, setLocation] = useState<Location | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push('/login');
        return null;
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        // Validate file types
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            setError('Only image files are allowed');
            return;
        }

        // Create previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });

        setImages(prev => [...prev, ...validFiles]);
        setError(null);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const uploadImages = async (): Promise<string[]> => {
        if (!user) return [];

        const uploadPromises = images.map(async (file) => {
            const fileName = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `listings/${user.uid}/${fileName}`);
            await uploadBytes(storageRef, file);
            return getDownloadURL(storageRef);
        });

        return Promise.all(uploadPromises);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            setError('You must be logged in to create a listing');
            return;
        }

        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }

        if (!description.trim()) {
            setError('Please enter a description');
            return;
        }

        if (images.length === 0) {
            setError('Please add at least one image');
            return;
        }

        try {
            setIsSubmitting(true);

            // Upload images
            const imageUrls = await uploadImages();

            // Create listing document
            const listingData = {
                title: title.trim(),
                description: description.trim(),
                category,
                condition,
                price: isFree ? 0 : price,
                images: imageUrls,
                location: location || null,
                userId: user.uid,
                userEmail: user.email,
                userDisplayName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
                userPhotoURL: user.photoURL || null,
                status: 'active',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'listings'), listingData);

            router.push(`/listings/${docRef.id}`);
        } catch (err: any) {
            console.error('Error creating listing:', err);
            setError(err.message || 'Failed to create listing');
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

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Create New Listing</h1>
                        <p className="text-muted">Share your item with the RTU community</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        {/* Images */}
                        <div className="card">
                            <label className="block text-sm font-medium mb-3">
                                Photos <span className="text-destructive">*</span>
                            </label>

                            <div className="flex flex-wrap gap-3">
                                {/* Image Previews */}
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative w-24 h-24">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg border border-border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white text-xs flex items-center justify-center hover:opacity-80"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                {/* Add Image Button */}
                                {images.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors"
                                    >
                                        <span className="text-2xl">+</span>
                                        <span className="text-xs">Add Photo</span>
                                    </button>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                            <p className="text-xs text-muted mt-2">
                                Add up to 5 photos. First photo will be the cover.
                            </p>
                        </div>

                        {/* Title */}
                        <div className="card">
                            <label className="block text-sm font-medium mb-2">
                                Title <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What are you selling?"
                                className="input"
                                maxLength={100}
                                required
                            />
                        </div>

                        {/* Category & Condition */}
                        <div className="card grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                                    className="input"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Condition</label>
                                <select
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value as ConditionId)}
                                    className="input"
                                >
                                    {CONDITIONS.map(cond => (
                                        <option key={cond.id} value={cond.id}>
                                            {cond.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="card">
                            <label className="block text-sm font-medium mb-2">
                                Description <span className="text-destructive">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your item... Include details like size, brand, any defects, etc."
                                className="input min-h-[120px] resize-y"
                                maxLength={1000}
                                required
                            />
                            <p className="text-xs text-muted mt-1">
                                {description.length}/1000 characters
                            </p>
                        </div>

                        {/* Price */}
                        <div className="card">
                            <label className="block text-sm font-medium mb-2">Price</label>

                            <div className="flex items-center gap-4 mb-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isFree}
                                        onChange={(e) => setIsFree(e.target.checked)}
                                        className="w-4 h-4 text-primary rounded"
                                    />
                                    <span className="text-sm">Give away for free</span>
                                </label>
                            </div>

                            {!isFree && (
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">€</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                                        placeholder="0.00"
                                        className="input pl-8"
                                        min="0"
                                        step="0.50"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Meeting Location */}
                        <div className="card">
                            <label className="block text-sm font-medium mb-2">
                                Meeting Location <span className="text-muted text-xs">(optional)</span>
                            </label>
                            <p className="text-sm text-muted mb-3">
                                Select a safe meeting point on campus for the exchange
                            </p>
                            <LocationPicker value={location} onChange={setLocation} />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full py-3 text-base"
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
