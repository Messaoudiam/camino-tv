/**
 * Section deals PREMIUM - Shadcn ultra-moderne
 * UX épurée avec Tabs, Slider, Select - focus utilisateur
 */

import { useState } from 'react';
import { Filter, Grid3X3, Star, Zap, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DealGrid } from '@/components/demo/DealGrid';
import { Deal } from '@/types';
import { mockDeals, categories } from '@/data/mock';
import { cn } from '@/lib/utils';

interface DealsSectionProps {
  className?: string;
}

export function DealsSection({ className }: DealsSectionProps) {
  const [deals] = useState<Deal[]>(mockDeals);
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([500]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [minDiscount, setMinDiscount] = useState<number[]>([0]);
  const { favorites, favoritesCount } = useFavorites();

  // Filtrage intelligent et tri des deals
  const filteredDeals = deals
    .filter(deal => {
      if (activeTab !== 'all' && deal.category !== activeTab) return false;
      if (deal.currentPrice > priceRange[0]) return false;
      if (deal.discountPercentage < minDiscount[0]) return false;
      if (onlyNew && !deal.isNew) return false;
      if (onlyFavorites && !favorites.includes(deal.id)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.currentPrice - b.currentPrice;
        case 'price-desc': return b.currentPrice - a.currentPrice;
        case 'discount': return b.discountPercentage - a.discountPercentage;
        case 'newest': return a.isNew ? -1 : 1;
        default: return 0;
      }
    });

  return (
    <TooltipProvider>
      <section 
        id="deals-section"
        className={cn('py-8', className)}
      >
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header premium avec métriques */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-foreground">
                Les bons plans du moment
              </h1>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-red-500 text-white animate-pulse">
                      <Zap className="h-3 w-3 mr-1" />
                      LIVE
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mis à jour en temps réel</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Stats intelligentes */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{filteredDeals.length} deals</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span>Réduction moyenne {Math.round(deals.reduce((acc, deal) => acc + deal.discountPercentage, 0) / deals.length)}%</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{deals.filter(d => d.isNew).length} nouveautés</span>
            </div>

            {/* Navigation par Tabs premium */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
              
                {/* Tabs categories */}
                <div className="w-full lg:flex-1">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Tout</span>
                    <Badge variant="secondary" className="ml-1 h-4 text-xs">
                      {deals.length}
                    </Badge>
                  </TabsTrigger>
                  
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center gap-1"
                    >
                      <span className="truncate">{category.name}</span>
                      {category.count > 0 && (
                        <Badge variant="secondary" className="h-4 text-xs">
                          {category.count}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                </div>

                {/* Controls avancés */}
                <div className="flex items-center gap-4">
                
                {/* Tri intelligent */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">🔥 Nouveautés</SelectItem>
                    <SelectItem value="discount">💰 % Réduction</SelectItem>
                    <SelectItem value="price-asc">💸 Prix croissant</SelectItem>
                    <SelectItem value="price-desc">💎 Prix décroissant</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtres rapides avec switches */}
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="only-new"
                          checked={onlyNew}
                          onCheckedChange={setOnlyNew}
                        />
                        <label htmlFor="only-new" className="text-sm cursor-pointer">
                          🔥 Nouveau
                        </label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Afficher uniquement les nouveautés</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="only-favorites"
                          checked={onlyFavorites}
                          onCheckedChange={setOnlyFavorites}
                        />
                        <label htmlFor="only-favorites" className="text-sm cursor-pointer flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          Favoris
                          {favoritesCount > 0 && (
                            <Badge variant="secondary" className="h-4 text-xs">
                              {favoritesCount}
                            </Badge>
                          )}
                        </label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Afficher uniquement vos favoris</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                </div>
              </div>

            {/* Sliders premium pour filtres avancés */}
            <div className="bg-background border border-border rounded-lg p-6 mb-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Prix maximum avec Slider Shadcn */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Prix maximum
                    </label>
                    <Badge variant="outline" className="text-sm">
                      ≤ {priceRange[0]}€
                    </Badge>
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0€</span>
                    <span>500€</span>
                  </div>
                </div>

                {/* Réduction minimum */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Réduction minimum
                    </label>
                    <Badge variant="outline" className="text-sm">
                      ≥ {minDiscount[0]}%
                    </Badge>
                  </div>
                  <Slider
                    value={minDiscount}
                    onValueChange={setMinDiscount}
                    max={50}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>

              {/* Reset filters */}
              <div className="flex items-center justify-center mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPriceRange([500]);
                    setMinDiscount([0]);
                    setOnlyNew(false);
                    setOnlyFavorites(false);
                    setSortBy('newest');
                  }}
                  className="text-muted-foreground hover:text-foreground">
                  <Filter className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                  </Button>
                </div>
              </div>

              {/* Contenu des tabs avec deals */}
              <TabsContent value="all" className="mt-0">
                <DealGrid deals={filteredDeals} loading={loading} />
              </TabsContent>
            
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <DealGrid deals={filteredDeals} loading={loading} />
                </TabsContent>
              ))}

              {/* État vide avec design premium */}
              {filteredDeals.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Aucun deal trouvé
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Essayez d'ajuster vos critères de recherche ou explorez d'autres catégories
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveTab('all');
                    setOnlyNew(false);
                    setOnlyFavorites(false);
                    setPriceRange([500]);
                    setMinDiscount([0]);
                  }}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Réinitialiser les filtres
                </Button>
                </div>
              )}
            </Tabs>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}