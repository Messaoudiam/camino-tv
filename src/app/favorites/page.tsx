'use client';

/**
 * Page Mes Favoris - Interface premium pour les bons plans favoris
 * Design système cohérent avec l'UI/UX existante de Camino TV
 */

import { useState, useEffect } from 'react';
import { Heart, Search, Filter, Grid3X3, List, Trash2, Share2, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { DealCard } from '@/components/demo/DealCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFavorites } from '@/hooks/useFavorites';
import { mockDeals } from '@/data/mock';
import { cn } from '@/lib/utils';
import type { Deal } from '@/types';

export default function FavoritesPage() {
  const { favorites, isLoading, favoritesCount } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteDeals, setFavoriteDeals] = useState<Deal[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Filtrer les bons plans favoris depuis les données mock
  useEffect(() => {
    const filteredDeals = mockDeals.filter(deal => favorites.includes(deal.id));
    setFavoriteDeals(filteredDeals);
  }, [favorites]);

  // Filtrage et tri des favoris
  const processedDeals = favoriteDeals
    .filter(deal => {
      if (filterBy !== 'all' && deal.category !== filterBy) return false;
      if (searchQuery) {
        return deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               deal.brand.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.currentPrice - b.currentPrice;
        case 'price-desc':
          return b.currentPrice - a.currentPrice;
        case 'discount':
          return b.discountPercentage - a.discountPercentage;
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

  // Catégories disponibles dans les favoris
  const availableCategories = Array.from(new Set(favoriteDeals.map(deal => deal.category)));

  // Fonction pour vider tous les favoris
  const handleClearFavorites = () => {
    localStorage.removeItem('camino-favorites');
    setShowClearDialog(false);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-48"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-80 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <Breadcrumb />
          
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 md:h-8 md:w-8 text-red-500 fill-red-500" />
                  <h1 className="text-xl md:text-3xl font-bold text-foreground">Mes Favoris</h1>
                </div>
                <Badge variant="secondary" className="text-xs md:text-sm">
                  {favoritesCount} {favoritesCount <= 1 ? 'deal' : 'deals'}
                </Badge>
              </div>
              
              {/* Actions */}
              {favoritesCount > 0 && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Mes favoris Camino TV',
                          text: `Découvrez mes ${favoritesCount} bons plans favoris sur Camino TV`,
                          url: window.location.href
                        });
                      }
                    }}
                    className="px-2 md:px-3"
                  >
                    <Share2 className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Partager</span>
                  </Button>
                  
                  <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 md:px-3"
                      >
                        <Trash2 className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">Vider</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Vider tous les favoris
                        </DialogTitle>
                        <DialogDescription>
                          Êtes-vous sûr de vouloir supprimer tous vos bons plans favoris ? 
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowClearDialog(false)}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleClearFavorites}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Vider tous les favoris
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
            
            <p className="text-muted-foreground">
              Retrouvez ici tous vos deals sneakers et streetwear favoris. 
              Organisez et filtrez votre collection personnelle.
            </p>
          </div>

          {/* État vide avec style cohérent */}
          {favoritesCount === 0 ? (
            <div className="text-center py-16 space-y-6">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Aucun favori pour le moment
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Commencez à sauvegarder vos bons plans préférés en cliquant sur le cœur 
                  sur les cartes de produits. Ils apparaîtront ici pour un accès rapide.
                </p>
              </div>
              <Button asChild className="bg-foreground hover:bg-foreground/90 text-background">
                <a href="/deals">
                  Découvrir les bons plans
                </a>
              </Button>
            </div>
          ) : (
            <>
              {/* Barre de recherche et filtres */}
              <div className="bg-muted/50 rounded-lg p-3 md:p-4 space-y-4">
                <div className="flex flex-col gap-3 md:gap-4">
                  {/* Recherche */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher dans vos favoris..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Filtres et mode d'affichage - Layout optimisé desktop */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Desktop: filtres compacts */}
                    <div className="hidden sm:flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Filter className="h-4 w-4" />
                        <span>Filtres:</span>
                      </div>
                      
                      <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          {availableCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category === 'sneakers' ? 'Sneakers' : 
                               category === 'streetwear' ? 'Streetwear' : 
                               category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Plus récent</SelectItem>
                          <SelectItem value="price-asc">Prix croissant</SelectItem>
                          <SelectItem value="price-desc">Prix décroissant</SelectItem>
                          <SelectItem value="discount">Meilleure réduction</SelectItem>
                          <SelectItem value="brand">Marque A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Desktop: Mode d'affichage à droite */}
                    <div className="hidden sm:flex items-center border rounded-md">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-r-none"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-l-none"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Mobile: filtres sans icône encombrante */}
                    <div className="flex sm:hidden flex-col gap-3">
                      <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {availableCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category === 'sneakers' ? 'Sneakers' : 
                               category === 'streetwear' ? 'Streetwear' : 
                               category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Plus récent</SelectItem>
                          <SelectItem value="price-asc">Prix croissant</SelectItem>
                          <SelectItem value="price-desc">Prix décroissant</SelectItem>
                          <SelectItem value="discount">Meilleure réduction</SelectItem>
                          <SelectItem value="brand">Marque A-Z</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Filtres actifs */}
                <div className="flex flex-wrap items-center gap-2">
                  {searchQuery && (
                    <Badge variant="outline" className="gap-1">
                      Recherche: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  
                  {filterBy !== 'all' && (
                    <Badge variant="outline" className="gap-1">
                      Catégorie: {filterBy}
                      <button
                        onClick={() => setFilterBy('all')}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Résultats */}
              {processedDeals.length === 0 ? (
                <Alert>
                  <Search className="h-4 w-4" />
                  <AlertDescription>
                    Aucun favori ne correspond à vos critères de recherche. 
                    Essayez de modifier vos filtres.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {processedDeals.length} résultat{processedDeals.length > 1 ? 's' : ''} 
                      {searchQuery || filterBy !== 'all' ? ' trouvé' + (processedDeals.length > 1 ? 's' : '') : ''}
                    </p>
                  </div>
                  
                  {/* Grille de deals - responsive et adaptative */}
                  <div className={cn(
                    'transition-all duration-300',
                    // Mobile : toujours grille 1 colonne optimisée
                    'grid grid-cols-1 gap-4',
                    // Tablet et plus : respect du mode choisi
                    'md:gap-6',
                    viewMode === 'grid' 
                      ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'md:grid-cols-1 md:max-w-4xl md:mx-auto'
                  )}>
                    {processedDeals.map(deal => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        className={cn(
                          'transition-all duration-200',
                          // Optimisation mobile : cartes plus compactes
                          'w-full',
                          // Mode liste sur desktop : largeur limitée
                          viewMode === 'list' && 'md:max-w-none'
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Statistiques des favoris */}
              <div className="bg-muted/50 rounded-lg p-4 md:p-6 space-y-4">
                <h3 className="font-semibold text-foreground text-sm md:text-base">Statistiques de vos favoris</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <div className="text-center p-2">
                    <div className="text-xl md:text-2xl font-bold text-foreground">{favoritesCount}</div>
                    <div className="text-xs text-muted-foreground">Total bons plans</div>
                  </div>
                  <div className="text-center p-2">
                    <div className="text-xl md:text-2xl font-bold text-green-600">
                      {Math.round(favoriteDeals.reduce((acc, deal) => acc + deal.discountPercentage, 0) / favoriteDeals.length) || 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Réduction moyenne</div>
                  </div>
                  <div className="text-center p-2">
                    <div className="text-xl md:text-2xl font-bold text-blue-600">
                      {Math.round(favoriteDeals.reduce((acc, deal) => acc + (deal.originalPrice - deal.currentPrice), 0)) || 0}€
                    </div>
                    <div className="text-xs text-muted-foreground">Économies totales</div>
                  </div>
                  <div className="text-center p-2">
                    <div className="text-xl md:text-2xl font-bold text-purple-600">
                      {availableCategories.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Catégories</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}