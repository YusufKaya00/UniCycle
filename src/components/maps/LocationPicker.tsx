'use client';

import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Location } from '@/lib/types';

interface LocationPickerProps {
    value: Location | null;
    onChange: (location: Location | null) => void;
}

const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '0.5rem',
};

// Riga Technical University center coordinates
const defaultCenter = {
    lat: 56.9496,
    lng: 24.1052,
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
};

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places'],
    });

    const [searchInput, setSearchInput] = useState('');
    const mapRef = useRef<google.maps.Map | null>(null);
    const geocoderRef = useRef<google.maps.Geocoder | null>(null);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        geocoderRef.current = new google.maps.Geocoder();
    }, []);

    const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
        if (!event.latLng || !geocoderRef.current) return;

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        try {
            const response = await geocoderRef.current.geocode({ location: { lat, lng } });
            const address = response.results[0]?.formatted_address || 'Unknown location';

            onChange({
                lat,
                lng,
                address,
            });
        } catch (error) {
            onChange({
                lat,
                lng,
                address: 'Selected location',
            });
        }
    }, [onChange]);

    const handleSearch = useCallback(async () => {
        if (!searchInput || !geocoderRef.current || !mapRef.current) return;

        try {
            const response = await geocoderRef.current.geocode({ address: searchInput });
            if (response.results[0]) {
                const { lat, lng } = response.results[0].geometry.location;
                const location = {
                    lat: lat(),
                    lng: lng(),
                    address: response.results[0].formatted_address,
                };

                onChange(location);
                mapRef.current.panTo({ lat: location.lat, lng: location.lng });
                mapRef.current.setZoom(16);
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    }, [searchInput, onChange]);

    const clearLocation = () => {
        onChange(null);
        setSearchInput('');
    };

    if (loadError) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-destructive text-sm">
                Error loading maps. Please check your API key.
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="h-[300px] skeleton flex items-center justify-center">
                <span className="text-muted">Loading map...</span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search for a location..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="input flex-1"
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    className="btn btn-secondary"
                >
                    Search
                </button>
            </div>

            {/* Map */}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={value ? { lat: value.lat, lng: value.lng } : defaultCenter}
                zoom={value ? 16 : 14}
                options={mapOptions}
                onClick={handleMapClick}
                onLoad={onMapLoad}
            >
                {value && (
                    <Marker
                        position={{ lat: value.lat, lng: value.lng }}
                        animation={google.maps.Animation.DROP}
                    />
                )}
            </GoogleMap>

            {/* Selected Location Display */}
            {value && (
                <div className="flex items-start justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex-1">
                        <p className="text-sm font-medium">Selected Meeting Point:</p>
                        <p className="text-sm text-muted">{value.address}</p>
                    </div>
                    <button
                        type="button"
                        onClick={clearLocation}
                        className="text-destructive hover:underline text-sm"
                    >
                        Clear
                    </button>
                </div>
            )}

            {!value && (
                <p className="text-sm text-muted">
                    Click on the map to select a meeting point
                </p>
            )}
        </div>
    );
}
