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
        <Link href={`/listings/${listing.id}`}>
            <div className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-secondary">
                    {listing.images && listing.images.length > 0 ? (
                        <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-secondary to-border">
                            {category?.icon || '📦'}
                        </div>
                    )}

                    {/* Status Badge */}
                    {listing.status !== 'active' && (
                        <div className={`absolute top-2.5 right-2.5 badge ${listing.status === 'reserved' ? 'badge-yellow' : 'badge-gray'
                            }`}>
                            {listing.status === 'reserved' ? t('card.reserved') : t('card.sold')}
                        </div>
                    )}

                    {/* Free Badge */}
                    {listing.price === 0 && listing.status === 'active' && (
                        <div className="absolute top-2.5 left-2.5 badge badge-green">
                            {t('card.free')}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-4">
                    {/* Category */}
                    <div className="flex items-center gap-1 text-xs text-muted mb-1">
                        <span>{category?.icon}</span>
                        <span>{category?.name}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-1 text-sm">
                        {listing.title}
                    </h3>

                    {/* Condition */}
                    <p className="text-xs text-muted mb-2">
                        {condition?.name}
                    </p>

                    {/* Bottom Row */}
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
                        {/* Price */}
                        <span className={`font-bold text-sm ${listing.price === 0 ? 'text-success' : 'text-primary'}`}>
                            {formatPrice(listing.price)}
                        </span>

                        {/* Time */}
                        <span className="text-xs text-muted">
                            {listing.createdAt && formatRelativeTime(listing.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
