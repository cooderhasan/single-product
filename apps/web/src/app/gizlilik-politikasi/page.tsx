import { PolicyPageContent } from '@/components/common/PolicyPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | 360 Sehpa',
  description: 'Gizlilik ve veri güvenliği politikamız.',
};

export default function PrivacyPolicyPage() {
  return <PolicyPageContent contentKey="policy_privacy" defaultTitle="Gizlilik Politikası" />;
}
