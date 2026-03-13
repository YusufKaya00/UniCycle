// Shared Google Maps configuration
// This ensures the loader is always initialized with the same options
// across all components, preventing the "Loader must not be called again
// with different options" error.

import { Libraries } from '@react-google-maps/api';

export const GOOGLE_MAPS_LIBRARIES: Libraries = ['places'];

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
