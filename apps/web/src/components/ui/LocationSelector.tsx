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
      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
        {label}
      </label>
      
      <div className="relative group">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10 group-hover:text-primary-600 transition-colors" />
        
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className={cn(
            "w-full appearance-none bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-10 text-sm font-medium focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 transition-all duration-200 cursor-pointer hover:border-slate-300",
            error ? "border-red-500" : "border-slate-200",
            isDisabled && "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
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
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg 
            className="w-5 h-5 text-slate-400" 
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
