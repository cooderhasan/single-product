import { PolicyPageContent } from '@/components/common/PolicyPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hizmet Şartları | 360 Sehpa',
  description: 'Kullanım koşulları ve hizmet şartları.',
};

export default function TermsPage() {
  return <PolicyPageContent contentKey="policy_terms" defaultTitle="Hizmet Şartları" />;
}
