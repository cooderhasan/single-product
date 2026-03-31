import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'İletişim | 360 Sehpa',
  description: 'Bize ulaşın. 0555 123 45 67 - info@360sehpa.com',
};

export default function ContactPage() {
  return <ContactClient />;
}
