'use client';

import Link from 'next/link';
import { Listing } from '@/lib/types';
import { CATEGORIES, CONDITIONS } from '@/lib/constants';
import { formatPrice, formatRelativeTime } from '@/lib/utils';

interface ListingCardProps {
    listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
    const category = CATEGORIES.find(c => c.id === listing.category);
    const condition = CONDITIONS.find(c => c.id === listing.condition);

    return (
        <Link href={`/listings/${listing.id}`}>
            <div className="card card-clickable h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-secondary">
                    {listing.images && listing.images.length > 0 ? (
                        <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                            {category?.icon || '📦'}
                        </div>
                    )}

                    {/* Status Badge */}
                    {listing.status !== 'active' && (
                        <div className={`absolute top-2 right-2 badge ${listing.status === 'reserved' ? 'badge-yellow' : 'badge-gray'
                            }`}>
                            {listing.status === 'reserved' ? 'Reserved' : 'Sold'}
                        </div>
                    )}

                    {/* Free Badge */}
                    {listing.price === 0 && listing.status === 'active' && (
                        <div className="absolute top-2 left-2 badge badge-green">
                            Free
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    {/* Category */}
                    <div className="flex items-center gap-1 text-xs text-muted mb-1">
                        <span>{category?.icon}</span>
                        <span>{category?.name}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                        {listing.title}
                    </h3>

                    {/* Condition */}
                    <p className="text-xs text-muted mb-2">
                        {condition?.name}
                    </p>

                    {/* Bottom Row */}
                    <div className="mt-auto flex items-center justify-between">
                        {/* Price */}
                        <span className={`font-bold ${listing.price === 0 ? 'text-success' : 'text-primary'}`}>
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
