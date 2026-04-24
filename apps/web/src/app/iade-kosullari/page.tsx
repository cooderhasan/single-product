import { PolicyPageContent } from '@/components/common/PolicyPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İade Koşulları | 360 Sehpa',
  description: 'Ürün iade ve değişim koşulları.',
};

export default function RefundTermsPage() {
  return <PolicyPageContent contentKey="policy_refund" defaultTitle="İade Koşulları" />;
}
