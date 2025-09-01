'use client';

/**
 * Page Deals - Tous les deals dans une page dédiée
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/ui/page-header';
import { DealsSection } from '@/components/sections/DealsSection';
import { Zap, Package } from 'lucide-react';
import { mockDeals } from '@/data/mock';

export default function DealsPage() {
  const dealsCount = mockDeals.length;
  const hasDiscounts = mockDeals.some(deal => deal.discountPercentage > 0);
  const hasNewItems = mockDeals.some(deal => deal.isNew);

  // Configuration dynamique selon le contexte
  const getBadgeConfig = () => {
    if (dealsCount === 0) {
      return { icon: Package, text: 'Bientôt des deals' };
    }
    if (hasDiscounts) {
      return { icon: Zap, text: 'Sélection LIVE' };
    }
    if (hasNewItems) {
      return { icon: Zap, text: 'Nouveautés' };
    }
    return { icon: Package, text: 'Sélection' };
  };

  const getTitle = () => {
    if (dealsCount === 0) {
      return 'Aucun bon plan pour le moment';
    }
    return hasDiscounts 
      ? 'Nos bons plans du moment'
      : 'Les bons plans du moment';
  };

  const getDescription = () => {
    if (dealsCount === 0) {
      return 'Notre équipe travaille à dénicher les meilleures offres streetwear. Revenez bientôt !';
    }
    if (hasDiscounts) {
      return 'Découvrez notre sélection de produits streetwear en promotion, soigneusement choisis par notre équipe.';
    }
    return 'Découvrez notre sélection de produits streetwear de qualité, choisis avec soin par notre équipe.';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageHeader
        badge={getBadgeConfig()}
        title={getTitle()}
        description={getDescription()}
      />
      
      <DealsSection />
      
      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}