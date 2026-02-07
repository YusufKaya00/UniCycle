'use client';

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Location } from '@/lib/types';

interface LocationDisplayProps {
    location: Location;
    height?: string;
}

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    draggable: true,
};

export default function LocationDisplay({ location, height = '200px' }: LocationDisplayProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    if (loadError) {
        return (
            <div className="p-4 bg-secondary rounded-lg text-sm text-muted">
                Unable to load map
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div style={{ height }} className="skeleton flex items-center justify-center">
                <span className="text-muted">Loading map...</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height, borderRadius: '0.5rem' }}
                center={{ lat: location.lat, lng: location.lng }}
                zoom={16}
                options={mapOptions}
            >
                <Marker
                    position={{ lat: location.lat, lng: location.lng }}
                />
            </GoogleMap>

            <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">📍</span>
                <span className="text-muted">{location.address}</span>
            </div>
        </div>
    );
}
