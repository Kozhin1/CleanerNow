import React from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

type DisputeFormProps = {
  bookingId: string;
  onSuccess: () => void;
};

type DisputeFormData = {
  type: string;
  description: string;
};

export default function DisputeForm({ bookingId, onSuccess }: DisputeFormProps) {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<DisputeFormData>();

  const onSubmit = async (data: DisputeFormData) => {
    try {
      const { error } = await supabase
        .from('disputes')
        .insert([
          {
            booking_id: bookingId,
            reporter_id: user!.id,
            type: data.type,
            description: data.description,
          },
        ]);

      if (error) throw error;

      toast.success('Dispute submitted successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to submit dispute');
      console.error('Dispute error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Issue Type</label>
        <select
          {...register('type', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300"
        >
          <option value="">Select an issue type</option>
          <option value="quality">Quality of Service</option>
          <option value="damage">Property Damage</option>
          <option value="behavior">Unprofessional Behavior</option>
          <option value="timing">Timing/Schedule Issues</option>
          <option value="payment">Payment Dispute</option>
          <option value="other">Other</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">Please select an issue type</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description', { required: true, minLength: 20 })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300"
          placeholder="Please provide detailed information about the issue..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            Please provide a detailed description (minimum 20 characters)
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-700"
      >
        Submit Dispute
      </button>
    </form>
  );
}