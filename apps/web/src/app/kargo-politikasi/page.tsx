import { PolicyPageContent } from '@/components/common/PolicyPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kargo Politikası | 360 Sehpa',
  description: 'Teslimat süreçleri ve kargo politikamız.',
};

export default function ShippingPolicyPage() {
  return <PolicyPageContent contentKey="kargo-politikasi" defaultTitle="Kargo Politikası" />;
}
