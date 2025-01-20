import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { debounce } from 'lodash';

// ... rest of the imports

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

  // ... rest of the component code
}