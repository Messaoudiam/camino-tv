'use client';

/**
 * Page Deals - Tous les deals dans une page dédiée
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { DealsSection } from '@/components/sections/DealsSection';

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Breadcrumb />
      </div>
      <DealsSection />
      
      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}