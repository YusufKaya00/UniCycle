// Listing Categories
export const CATEGORIES = [
    { id: 'electronics', name: 'Electronics', icon: '💻', description: 'Heaters, fans, chargers, etc.' },
    { id: 'clean', name: 'Clean', icon: '🧹', description: 'Cleaning supplies and products' },
    { id: 'cooking', name: 'Cooking', icon: '🍳', description: 'Kitchen items and cookware' },
    { id: 'home', name: 'Home Things', icon: '🛏️', description: 'Bed, pillow, blankets, furniture' },
    { id: 'personal', name: 'Personal Needs', icon: '🎒', description: 'Personal items and accessories' },
    { id: 'other', name: 'Others', icon: '📦', description: 'Miscellaneous items' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

// Item Conditions
export const CONDITIONS = [
    { id: 'new', name: 'New', description: 'Never used, with tags' },
    { id: 'like-new', name: 'Like New', description: 'Used once or twice, perfect condition' },
    { id: 'good', name: 'Good', description: 'Used but in good condition' },
    { id: 'fair', name: 'Fair', description: 'Shows signs of wear but functional' },
] as const;

export type ConditionId = typeof CONDITIONS[number]['id'];

// Listing Status
export const STATUSES = [
    { id: 'active', name: 'Active', color: 'green' },
    { id: 'reserved', name: 'Reserved', color: 'yellow' },
    { id: 'sold', name: 'Sold', color: 'gray' },
] as const;

export type StatusId = typeof STATUSES[number]['id'];

// Allowed Email Domain
export const ALLOWED_EMAIL_DOMAIN = 'edu.rtu.lv';

// Helper to check if email is valid
export const isValidUniversityEmail = (email: string): boolean => {
    return email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);
};
