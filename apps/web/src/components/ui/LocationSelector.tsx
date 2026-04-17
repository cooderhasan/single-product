'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { TURKEY_LOCATIONS, City } from '@/constants/turkey-locations';
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
  const [isOpen, setIsOpen] = useState(false);

  const options = useMemo(() => {
    if (type === 'city') {
      return TURKEY_LOCATIONS.map(c => c.name);
    } else {
      const city = TURKEY_LOCATIONS.find(c => c.name === selectedCity);
      return city ? city.districts : [];
    }
  }, [type, selectedCity]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      {/* Custom Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={type === 'district' && !selectedCity}
        className={cn(
          "w-full bg-white border rounded-lg py-2.5 pl-4 pr-10 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all flex items-center justify-between",
          error ? "border-red-500" : "border-gray-200",
          type === 'district' && !selectedCity && "bg-gray-100 text-gray-400 cursor-not-allowed"
        )}
      >
        <span className={cn("block truncate", !value && "text-gray-400")}>
          {value || placeholder || (type === 'city' ? "Şehir seçin" : "İlçe seçin")}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Options List */}
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-xl border border-gray-100 focus:outline-none">
            <div className="sticky top-0 z-10 bg-gray-50 px-3 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {type === 'city' ? 'Şehir Seçin' : `${selectedCity} İlçeleri`}
                </span>
              </div>
            </div>
            
            <div className="py-1">
              {options.length === 0 ? (
                <div className="py-4 px-4 text-gray-500 text-center italic text-sm">
                  {type === 'district' && !selectedCity 
                    ? "Önce şehir seçin" 
                    : "Sonuç bulunamadı."}
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary-50 flex items-center justify-between",
                      value === option ? "bg-primary-50 text-primary-700 font-medium" : "text-gray-700"
                    )}
                  >
                    <span>{option}</span>
                    {value === option && (
                      <span className="text-primary-600">✓</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
      
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
