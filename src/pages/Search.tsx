import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { debounce } from 'lodash';
import type { Database } from '@/lib/database.types';

type Cleaner = Database['public']['Tables']['profiles']['Row'] & {
  cleaner_profile: Database['public']['Tables']['cleaner_profiles']['Row'];
};

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  // Memoize services array
  const services = useMemo(() => [
    'House Cleaning',
    'Deep Cleaning',
    'Office Cleaning',
    'Move In/Out',
    'Window Cleaning',
  ], []);

  const { data: cleaners, isLoading } = useQuery({
    queryKey: ['cleaners', searchTerm, selectedService],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          cleaner_profile:cleaner_profiles(*)
        `)
        .eq('is_cleaner', true);

      if (searchTerm) {
        query = query.ilike('full_name', `%${searchTerm}%`);
      }

      if (selectedService) {
        query = query.contains('cleaner_profile.services_offered', [selectedService]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search cleaners..."
          className="w-full p-2 border rounded-lg"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <button
              key={service}
              onClick={() => setSelectedService(service)}
              className={`px-4 py-2 rounded-full ${
                selectedService === service
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : cleaners?.length === 0 ? (
        <div className="text-center text-gray-500">No cleaners found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cleaners?.map((cleaner: Cleaner) => (
            <Link
              key={cleaner.id}
              to={`/cleaner/${cleaner.id}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {cleaner.full_name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="ml-1">
                      {cleaner.cleaner_profile.years_experience} years exp.
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Starting at</p>
                  <p className="font-semibold">
                    ${cleaner.cleaner_profile.hourly_rate}/hr
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {cleaner.cleaner_profile.services_offered.join(', ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
