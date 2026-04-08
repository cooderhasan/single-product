'use client';

import { useEffect, useRef, useState } from 'react';
import { announcementsApi } from '@/lib/api';

interface TickerItem {
  id: string;
  message: string;
  link?: string;
}

// Varsayılan ticker öğeleri (API çalışmadığında)
const defaultTickerItems: TickerItem[] = [
  { id: '1', message: 'Saat 15.00\'dan Önce Verilen Siparişler Aynı Gün Kargoda..!' },
  { id: '2', message: 'Tüm Türkiye\'ye Ücretsiz Kargo..!' },
  { id: '3', message: '14 Gün İade Garantisi...!' },
];

export function TopTicker() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>(defaultTickerItems);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTickerItems = async () => {
      try {
        const response = await announcementsApi.getByPosition('TOP_TICKER');
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setTickerItems(response.data.map((item: any) => ({
            id: item.id,
            message: item.message,
            link: item.link,
          })));
        }
      } catch (error) {
        console.log('API bağlantı hatası - varsayılan ticker kullanılıyor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickerItems();
  }, []);

  useEffect(() => {
    if (!containerRef.current || tickerItems.length === 0) return;
    
    const container = containerRef.current;
    let position = 0;
    
    const animate = () => {
      position -= 0.5;
      if (position <= -container.scrollWidth / 2) {
        position = 0;
      }
      container.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [tickerItems]);

  if (isLoading || tickerItems.length === 0) {
    return null;
  }

  // Çoğaltılmış öğeler sürekli kayan efekt için
  const duplicatedItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="bg-primary-600 text-white py-3 overflow-hidden">
      <div 
        ref={containerRef}
        className="flex whitespace-nowrap"
        style={{ width: 'max-content' }}
      >
        {duplicatedItems.map((item, index) => (
          <span 
            key={`${item.id}-${index}`} 
            className="text-sm font-medium px-12 flex items-center"
          >
            <span className="mr-2">★</span>
            {item.link ? (
              <a href={item.link} className="hover:underline">
                {item.message}
              </a>
            ) : (
              item.message
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
