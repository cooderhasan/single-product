import { PolicyPageContent } from '@/components/common/PolicyPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Para İade Politikası | 360 Sehpa',
  description: 'Para iadesi ve ödeme geri aktarım süreçleri.',
};

export default function MoneyBackPage() {
  return <PolicyPageContent contentKey="para-iade-politikasi" defaultTitle="Para İade Politikası" />;
}
