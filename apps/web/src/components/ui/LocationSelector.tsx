'use client';

import { useState, useMemo } from 'react';
import { Combobox } from '@headlessui/react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
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
  const [query, setQuery] = useState('');

  const options = useMemo(() => {
    if (type === 'city') {
      return TURKEY_LOCATIONS.map(c => c.name);
    } else {
      const city = TURKEY_LOCATIONS.find(c => c.name === selectedCity);
      return city ? city.districts : [];
    }
  }, [type, selectedCity]);

  const filteredOptions = query === ''
    ? options
    : options.filter((option) =>
        option
          .toLowerCase()
          .replace(/i/g, 'İ')
          .replace(/ı/g, 'I')
          .includes(query.toLowerCase().replace(/i/g, 'İ').replace(/ı/g, 'I'))
      );

  return (
    <div className="w-full">
      <Combobox value={value} onChange={(val: string | null) => val && onChange(val)}>
        {({ open }) => (
          <div className="relative">
            <Combobox.Label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </Combobox.Label>
            <div className="relative">
              <Combobox.Input
                className={cn(
                  "w-full bg-white border rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all",
                  error ? "border-red-500" : "border-gray-200"
                )}
                displayValue={(val: string) => val}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder || (type === 'city' ? "Şehir ara..." : "İlçe ara...")}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronsUpDown className="h-4 h-4 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
            </div>

            <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-xl border border-gray-100 focus:outline-none sm:text-sm">
              <div className="sticky top-0 z-10 bg-white px-2 py-1.5 border-b border-gray-50 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  className="w-full text-xs focus:outline-none"
                  placeholder="Ara..."
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-4 px-4 text-gray-500 text-center italic text-sm">
                  Sonuç bulunamadı.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option}
                    className={({ active }) =>
                      cn(
                        "relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors",
                        active ? "bg-primary-50 text-primary-900" : "text-gray-900"
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={cn("block truncate", selected ? "font-semibold" : "font-normal")}>
                          {option}
                        </span>
                        {selected ? (
                          <span
                            className={cn(
                              "absolute inset-y-0 left-0 flex items-center pl-3",
                              active ? "text-primary-600" : "text-primary-600"
                            )}
                          >
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </div>
        )}
      </Combobox>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
