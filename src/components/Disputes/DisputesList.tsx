import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

type Dispute = {
  id: string;
  type: string;
  description: string;
  status: string;
  resolution: string | null;
  created_at: string;
  updated_at: string;
};

type DisputesListProps = {
  bookingId: string;
};

export default function DisputesList({ bookingId }: DisputesListProps) {
  const { data: disputes } = useQuery({
    queryKey: ['disputes', bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disputes')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Dispute[];
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'open':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!disputes?.length) {
    return <p className="text-gray-500">No disputes found</p>;
  }

  return (
    <div className="space-y-4">
      {disputes.map((dispute) => (
        <div key={dispute.id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getStatusIcon(dispute.status)}
              <span className="font-medium capitalize">{dispute.type}</span>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                dispute.status
              )}`}
            >
              {dispute.status}
            </span>
          </div>

          <p className="text-gray-600 mb-2">{dispute.description}</p>

          {dispute.resolution && (
            <div className="mt-2 p-2 bg-gray-50 rounded">
              <p className="text-sm font-medium">Resolution:</p>
              <p className="text-sm text-gray-600">{dispute.resolution}</p>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500">
            <span>Opened: {format(new Date(dispute.created_at), 'PPp')}</span>
            {dispute.status === 'resolved' && (
              <span className="ml-4">
                Resolved: {format(new Date(dispute.updated_at), 'PPp')}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}