'use client';

import { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { TURKEY_LOCATIONS } from '@/constants/turkey-locations';
import { cn } from '@/lib/utils';

interface LocationSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: 'city' | 'district';
  selectedCity?: string;
  error?: string;
  placeholder?: string;
}

export function LocationSelector({
  label,
  value,
  onChange,
  type,
  selectedCity,
  error,
  placeholder
}: LocationSelectorProps) {
  const options = useMemo(() => {
    if (type === 'city') {
      return TURKEY_LOCATIONS.map(c => c.name);
    } else {
      const city = TURKEY_LOCATIONS.find(c => c.name === selectedCity);
      return city ? city.districts : [];
    }
  }, [type, selectedCity]);

  const isDisabled = type === 'district' && !selectedCity;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
        
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className={cn(
            "w-full appearance-none bg-white border rounded-lg py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer",
            error ? "border-red-500" : "border-gray-200",
            isDisabled && "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          <option value="" disabled>
            {placeholder || (type === 'city' ? "Şehir seçin" : "İlçe seçin")}
          </option>
          
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        
        {/* Custom arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
