import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'WesternProperties',
  description: 'Goa real estate listings platform',
  metadataBase: new URL(process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || 'https://westernproperties.in'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
            <WhatsAppButton />
          </div>
        </Providers>
      </body>
    </html>
  );
}
