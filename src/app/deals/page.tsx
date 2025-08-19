'use client';

/**
 * Page Deals - Tous les deals dans une page dédiée
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/ui/page-header';
import { DealsSection } from '@/components/sections/DealsSection';
import { Zap } from 'lucide-react';
import { mockDeals } from '@/data/mock';
import { useFavorites } from '@/hooks/useFavorites';

export default function DealsPage() {
  const { favoritesCount } = useFavorites();
  
  const stats = [
    { value: mockDeals.length, label: 'Bons plans' },
    { value: '17%', label: 'Réduction moyenne' },
    { value: '4', label: 'Nouveautés' },
    { value: favoritesCount, label: 'Favoris' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageHeader
        badge={{
          icon: Zap,
          text: 'Bons plans LIVE'
        }}
        title="Les bons plans du moment"
        description="Découvrez les meilleures offres streetwear sélectionnées par notre équipe. Sneakers, vêtements et accessoires aux meilleurs prix du web."
        stats={stats}
      />
      
      <DealsSection />
      
      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}