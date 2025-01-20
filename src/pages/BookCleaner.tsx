import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

type BookingFormData = {
  service_date: string;
  duration_hours: number;
  service_type: string;
  special_instructions: string;
  address: string;
};

export default function BookCleaner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>();

  const { data: cleaner, isLoading } = useQuery({
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

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Please sign in to book a cleaner.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!cleaner) {
    return <div>Cleaner not found</div>;
  }

  const onSubmit = async (data: BookingFormData) => {
    try {
      const totalAmount = cleaner.cleaner_profile.hourly_rate * data.duration_hours;

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            client_id: user.id,
            cleaner_id: cleaner.id,
            service_date: data.service_date,
            duration_hours: data.duration_hours,
            total_amount: totalAmount,
            service_type: data.service_type,
            special_instructions: data.special_instructions,
            address: data.address,
          },
        ]);

      if (error) throw error;

      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (error) {
      toast.error('Failed to create booking');
      console.error('Booking error:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Book {cleaner.full_name}</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Date</label>
            <input
              type="datetime-local"
              {...register('service_date', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
            {errors.service_date && (
              <p className="mt-1 text-sm text-red-600">Service date is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
            <input
              type="number"
              min="1"
              step="0.5"
              {...register('duration_hours', { required: true, min: 1 })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
            {errors.duration_hours && (
              <p className="mt-1 text-sm text-red-600">Duration must be at least 1 hour</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Service Type</label>
            <select
              {...register('service_type', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300"
            >
              {cleaner.cleaner_profile.services_offered.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {errors.service_type && (
              <p className="mt-1 text-sm text-red-600">Service type is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              {...register('address', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">Address is required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Special Instructions
            </label>
            <textarea
              {...register('special_instructions')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Rate per hour:</span>
              <span className="font-medium">${cleaner.cleaner_profile.hourly_rate}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-700"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}