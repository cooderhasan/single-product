import { PolicyPageContent } from '@/components/common/PolicyPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi | 360 Sehpa',
  description: 'Mesafeli satış sözleşmesi ve alışveriş şartları.',
};

export default function SalesContractPage() {
  return <PolicyPageContent contentKey="policy_sales_contract" defaultTitle="Mesafeli Satış Sözleşmesi" />;
}
