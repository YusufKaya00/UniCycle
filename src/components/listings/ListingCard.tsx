'use client';

import Link from 'next/link';
import { Listing } from '@/lib/types';
import { CATEGORIES, CONDITIONS } from '@/lib/constants';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface ListingCardProps {
    listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
    const category = CATEGORIES.find(c => c.id === listing.category);
    const condition = CONDITIONS.find(c => c.id === listing.condition);
    const { t } = useLanguage();

    return (
        <Link href={`/listings/${listing.id}`} className="block group">
            <div className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover-lift h-full flex flex-col group-hover:border-primary/20">
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {listing.images && listing.images.length > 0 ? (
                        <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-secondary to-secondary-dark">
                            {category?.icon || '📦'}
                        </div>
                    )}

                    {/* Overlay for better readability of badges if image is bright */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Status Badge */}
                    {listing.status !== 'active' && (
                        <div className={`absolute top-3 right-3 badge shadow-sm backdrop-blur-md ${listing.status === 'reserved' ? 'bg-warning/90 text-white' : 'bg-muted/90 text-white'
                            }`}>
                            {listing.status === 'reserved' ? t('card.reserved') : t('card.sold')}
                        </div>
                    )}

                    {/* Free Badge */}
                    {listing.price === 0 && listing.status === 'active' && (
                        <div className="absolute top-3 left-3 badge bg-success/90 text-white shadow-sm backdrop-blur-md">
                            {t('card.free')}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col p-5">
                    {/* Category & Time */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary-light/50 text-[10px] font-bold text-primary uppercase tracking-wider">
                            <span>{category?.icon}</span>
                            <span>{category?.name}</span>
                        </div>
                        <span className="text-[10px] font-medium text-muted uppercase tracking-tight">
                            {listing.createdAt && formatRelativeTime(listing.createdAt)}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-foreground line-clamp-2 mb-2 text-base leading-tight group-hover:text-primary transition-colors duration-300">
                        {listing.title}
                    </h3>

                    {/* Condition */}
                    <div className="flex items-center gap-1.5 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                        <p className="text-xs font-medium text-muted">
                            {condition?.name}
                        </p>
                    </div>

                    {/* Bottom Row */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/40">
                        {/* Price */}
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted font-bold uppercase tracking-widest mb-0.5">Price</span>
                            <span className={`font-extrabold text-lg tracking-tight ${listing.price === 0 ? 'text-success' : 'text-foreground'}`}>
                                {listing.price === 0 ? t('card.free') : formatPrice(listing.price)}
                            </span>
                        </div>

                        {/* Action Hint */}
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
