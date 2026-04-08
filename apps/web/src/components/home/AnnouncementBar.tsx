'use client';

import { useEffect, useState } from 'react';
import { announcementsApi } from '@/lib/api';

interface Announcement {
  id: string;
  message: string;
  link?: string;
  bgColor: string;
  textColor: string;
}

// Varsayılan duyuru (API çalışmadığında)
const defaultAnnouncement: Announcement = {
  id: 'default',
  message: 'KREDİ KARTINA 12 TAKSİT FIRSATIYLA..!',
  bgColor: 'primary-700',
  textColor: 'white',
};

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement>(defaultAnnouncement);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await announcementsApi.getByPosition('ANNOUNCEMENT_BAR');
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setAnnouncement(response.data[0]);
        }
      } catch (error) {
        console.log('API bağlantı hatası - varsayılan duyuru kullanılıyor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  if (isLoading || !announcement) {
    return null;
  }

  const content = (
    <p className="text-sm font-semibold tracking-wide">
      {announcement.message}
    </p>
  );

  return (
    <div className={`bg-${announcement.bgColor} text-${announcement.textColor} py-2 text-center`}>
      {announcement.link ? (
        <a href={announcement.link} className="hover:underline">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
