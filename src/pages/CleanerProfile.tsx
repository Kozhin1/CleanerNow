import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Star, MapPin, Clock, Award } from 'lucide-react';
import ReviewsList from '@/components/ReviewsList';
import { Link } from 'react-router-dom';

export default function CleanerProfile() {
  const { id } = useParams();

  const { data: cleaner, isLoading: isLoadingCleaner } = useQuery({
    queryKey: ['cleaner', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          cleaner_profile (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['cleaner-reviews', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer: profiles!reviews_reviewer_id_fkey (
            full_name
          )
        `)
        .eq('reviewee_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingCleaner || isLoadingReviews) {
    return <div>Loading...</div>;
  }

  if (!cleaner) {
    return <div>Cleaner not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <img
              src={cleaner.avatar_url || 'https://via.placeholder.com/150'}
              alt={cleaner.full_name}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="ml-6">
              <h1 className="text-3xl font-bold mb-2">{cleaner.full_name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-lg">
                    {reviews?.length ? (
                      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                    ).toFixed(1) : 'No reviews'}
                  </span>
                </div>
                {cleaner.cleaner_profile.is_verified && (
                  <div className="flex items-center text-green-600">
                    <Award className="h-5 w-5" />
                    <span className="ml-1">Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-gray-600">{cleaner.cleaner_profile.bio}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="ml-2">
                    Service Areas: {cleaner.cleaner_profile.service_area.join(', ')}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="ml-2">
                    {cleaner.cleaner_profile.years_experience} years of experience
                  </span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Services Offered:</h3>
                  <div className="flex flex-wrap gap-2">
                    {cleaner.cleaner_profile.services_offered.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-primary-50 text-primary rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">
              ${cleaner.cleaner_profile.hourly_rate}/hour
            </div>
            <Link
              to={`/book/${cleaner.id}`}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-700"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <ReviewsList reviews={reviews} />
        ) : (
          <p className="text-gray-600">No reviews yet</p>
        )}
      </div>
    </div>
  );
}