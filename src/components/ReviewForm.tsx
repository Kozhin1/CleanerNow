import React from 'react';
import { useForm } from 'react-hook-form';

type ReviewFormProps = {
  bookingId: string;
  revieweeId: string;
  onSubmit: (data: ReviewFormData) => void;
};

type ReviewFormData = {
  rating: number;
  comment: string;
};

export default function ReviewForm({ bookingId, revieweeId, onSubmit }: ReviewFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ReviewFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <select
          {...register('rating', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        >
          <option value="">Select a rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
          ))}
        </select>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">Rating is required</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Comment</label>
        <textarea
          {...register('comment', { required: true })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">Comment is required</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Submit Review
      </button>
    </form>
  );
}