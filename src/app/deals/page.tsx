'use client';

/**
 * Page Deals - Tous les deals dans une page dédiée
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DealsSection } from '@/components/sections/DealsSection';

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DealsSection />
      
      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}