'use client';

import { useState, useEffect } from 'react';
import { siteContentApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface PolicyPageContentProps {
  contentKey: string;
  defaultTitle: string;
}

export function PolicyPageContent({ contentKey, defaultTitle }: PolicyPageContentProps) {
  const [content, setContent] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await siteContentApi.getByKey(contentKey);
        if (response.data) {
          setContent({
            title: response.data.title || defaultTitle,
            description: response.data.description || ''
          });
        }
      } catch (error) {
        console.error(`Error fetching policy content (${contentKey}):`, error);
        setContent({
          title: defaultTitle,
          description: 'İçerik henüz eklenmemiştir.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentKey, defaultTitle]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 border-b pb-6">
          {content?.title}
        </h1>
        <div 
          className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: content?.description?.replace(/\n/g, '<br />') || '' }}
        />
      </div>
    </div>
  );
}
