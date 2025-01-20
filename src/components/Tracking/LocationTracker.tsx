import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin } from 'lucide-react';

type LocationTrackerProps = {
  bookingId: string;
  cleanerId: string;
};

type TrackingSession = {
  id: string;
  current_location: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  status: string;
};

export default function LocationTracker({ bookingId, cleanerId }: LocationTrackerProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [watchId, setWatchId] = useState<number | null>(null);

  const { data: session } = useQuery({
    queryKey: ['tracking', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracking_sessions')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

      if (error) throw error;
      return data as TrackingSession;
    },
  });

  const updateLocation = useMutation({
    mutationFn: async (location: GeolocationPosition) => {
      const { error } = await supabase
        .from('tracking_sessions')
        .upsert({
          booking_id: bookingId,
          cleaner_id: user!.id,
          current_location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: new Date().toISOString(),
          },
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracking', bookingId] });
    },
  });

  useEffect(() => {
    if (user?.id === cleanerId) {
      const id = navigator.geolocation.watchPosition(
        (position) => updateLocation.mutate(position),
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true }
      );
      setWatchId(id);

      return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [user, cleanerId]);

  if (!session?.current_location) {
    return <div>No tracking information available</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Cleaner Location</h3>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Last updated: {new Date(session.current_location.timestamp).toLocaleTimeString()}
        </p>
        <p className="text-sm">
          Latitude: {session.current_location.latitude.toFixed(6)}
        </p>
        <p className="text-sm">
          Longitude: {session.current_location.longitude.toFixed(6)}
        </p>
      </div>

      {/* Here you would typically integrate with a mapping service like Google Maps */}
      <div className="mt-4 h-64 bg-gray-100 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Map view would be displayed here</p>
      </div>
    </div>
  );
}