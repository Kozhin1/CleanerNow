import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

type PricingRule = {
  id: string;
  name: string;
  description: string;
  conditions: {
    type: string;
    value: number;
  }[];
  price_modifier: number;
};

type DynamicPricingProps = {
  baseRate: number;
  serviceDate: Date;
  location: string;
  duration: number;
  onPriceCalculated: (price: number) => void;
};

export default function DynamicPricing({
  baseRate,
  serviceDate,
  location,
  duration,
  onPriceCalculated,
}: DynamicPricingProps) {
  const { data: pricingRules } = useQuery({
    queryKey: ['pricing-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data as PricingRule[];
    },
  });

  React.useEffect(() => {
    if (!pricingRules) return;

    let finalRate = baseRate;
    const hour = serviceDate.getHours();
    const day = serviceDate.getDay();
    const isWeekend = day === 0 || day === 6;

    // Apply pricing rules
    pricingRules.forEach((rule) => {
      rule.conditions.forEach((condition) => {
        switch (condition.type) {
          case 'peak_hours':
            if (hour >= 9 && hour <= 17) {
              finalRate *= 1 + condition.value;
            }
            break;
          case 'weekend':
            if (isWeekend) {
              finalRate *= 1 + condition.value;
            }
            break;
          case 'duration_discount':
            if (duration >= 3) {
              finalRate *= 1 - condition.value;
            }
            break;
          // Add more conditions as needed
        }
      });
    });

    onPriceCalculated(finalRate);
  }, [baseRate, serviceDate, location, duration, pricingRules]);

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-gray-700">Price Breakdown</h4>
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Base Rate</span>
          <span>${baseRate}/hour</span>
        </div>
        {pricingRules?.map((rule) => (
          <div key={rule.id} className="flex justify-between text-gray-600">
            <span>{rule.name}</span>
            <span>{rule.price_modifier > 0 ? '+' : '-'}
              {Math.abs(rule.price_modifier * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}