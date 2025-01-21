import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import ReviewForm from '../components/ReviewForm';
import { ChatWindow } from '../components/Chat/ChatWindow';
import DisputeForm from '../components/Disputes/DisputeForm';
import DisputesList from '../components/Disputes/DisputesList';
import LocationTracker from '../components/Tracking/LocationTracker';
import CleaningChecklist from '../components/Cleaning/CleaningChecklist';
import { toast } from 'react-hot-toast';

export default function Bookings() {
  const { user } = useAuth();

  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cleaner: profiles!bookings_cleaner_id_fkey (
            full_name,
            avatar_url,
            cleaner_profile (
              hourly_rate
            )
          )
        `)
        .eq('client_id', user.id)
        .order('service_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleReviewSubmit = async (data: { rating: number; comment: string }, bookingId: string, revieweeId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            booking_id: bookingId,
            reviewer_id: user!.id,
            reviewee_id: revieweeId,
            rating: data.rating,
            comment: data.comment,
          },
        ]);

      if (error) throw error;

      toast.success('Review submitted successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to submit review');
      console.error('Review error:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Please sign in to view your bookings.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="space-y-8">
        {bookings?.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={booking.cleaner.avatar_url || 'https://via.placeholder.com/50'}
                    alt={booking.cleaner.full_name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{booking.cleaner.full_name}</h3>
                    <p className="text-gray-600">{booking.service_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    ${booking.total_amount}
                  </div>
                  <div className="text-sm text-gray-600">
                    {booking.duration_hours} hours @ ${booking.cleaner.cleaner_profile.hourly_rate}/hr
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Date & Time</h4>
                  <p>{new Date(booking.service_date).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Status</h4>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Address</h4>
                  <p>{booking.address}</p>
                </div>
                {booking.special_instructions && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Special Instructions</h4>
                    <p>{booking.special_instructions}</p>
                  </div>
                )}
              </div>

              {/* Chat Section */}
              <div className="mt-6 border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">Chat with {booking.cleaner.full_name}</h4>
                <ChatWindow
                  bookingId={booking.id}
                  receiverId={booking.cleaner_id}
                />
              </div>

              {/* Location Tracking */}
              {booking.status === 'confirmed' && (
                <div className="mt-6 border-t pt-6">
                  <LocationTracker
                    bookingId={booking.id}
                    cleanerId={booking.cleaner_id}
                  />
                </div>
              )}

              {/* Cleaning Checklist */}
              <div className="mt-6 border-t pt-6">
                <CleaningChecklist
                  bookingId={booking.id}
                  isCleaner={false}
                />
              </div>

              {/* Disputes Section */}
              <div className="mt-6 border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">Disputes</h4>
                <DisputesList bookingId={booking.id} />
                <div className="mt-4">
                  <DisputeForm
                    bookingId={booking.id}
                    onSuccess={() => refetch()}
                  />
                </div>
              </div>

              {/* Reviews Section */}
              {booking.status === 'completed' && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-lg font-semibold mb-4">Leave a Review</h4>
                  <ReviewForm
                    bookingId={booking.id}
                    revieweeId={booking.cleaner_id}
                    onSubmit={(data) => handleReviewSubmit(data, booking.id, booking.cleaner_id)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {bookings?.length === 0 && (
          <p className="text-gray-600">You don't have any bookings yet.</p>
        )}
      </div>
    </div>
  );
}
