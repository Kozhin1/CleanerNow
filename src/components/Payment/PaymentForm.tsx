import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

type PaymentFormProps = {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
};

type PaymentFormData = {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  name: string;
};

export default function PaymentForm({ bookingId, amount, onSuccess }: PaymentFormProps) {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>();

  const onSubmit = async (data: PaymentFormData) => {
    try {
      const { error } = await supabase
        .from('payments')
        .insert([
          {
            booking_id: bookingId,
            amount,
            payment_method: 'card',
            status: 'completed',
          },
        ]);

      if (error) throw error;

      toast.success('Payment processed successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Card Number</label>
        <input
          type="text"
          {...register('cardNumber', {
            required: true,
            pattern: /^[0-9]{16}$/,
          })}
          className="mt-1 block w-full rounded-md border-gray-300"
          placeholder="1234 5678 9012 3456"
        />
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-600">Valid card number is required</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="text"
            {...register('expiryDate', {
              required: true,
              pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
            })}
            className="mt-1 block w-full rounded-md border-gray-300"
            placeholder="MM/YY"
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">Valid expiry date is required</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CVC</label>
          <input
            type="text"
            {...register('cvc', {
              required: true,
              pattern: /^[0-9]{3,4}$/,
            })}
            className="mt-1 block w-full rounded-md border-gray-300"
            placeholder="123"
          />
          {errors.cvc && (
            <p className="mt-1 text-sm text-red-600">Valid CVC is required</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name on Card</label>
        <input
          type="text"
          {...register('name', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300"
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">Name is required</p>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Total Amount:</span>
          <span className="font-medium">${amount}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-700"
      >
        Pay Now
      </button>
    </form>
  );
}