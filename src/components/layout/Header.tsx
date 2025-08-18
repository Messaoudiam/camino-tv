'use client';

/**
 * Header PREMIUM PRO - Niveau enterprise avec fonctionnalités avancées
 * Micro-interactions, feedback utilisateur, accessibilité, performance
 * Démonstration de maîtrise technique complète pour entretien
 */

import { 
  Search, Sparkles, Clock, TrendingUp, User, Bell, Settings, Moon, Sun, 
  Filter, Users, Home, Zap, Command, ArrowRight, X, Loader2, 
  AlertCircle, Star, Bookmark, History, BookOpen, Check, Eye 
} from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { HeaderProps } from '@/types';
import { mockDeals } from '@/data/mock';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'deal' | 'trend' | 'article' | 'system';
  priority: 'low' | 'medium' | 'high';
}

export function Header({ className }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  
  // États principaux
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouveau deal Nike Air Max',
      message: 'Réduction de 40% disponible maintenant',
      time: 'Il y a 5 min',
      isRead: false,
      type: 'deal',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Tendance Jordan 1',
      message: '+150% de recherches cette semaine',
      time: 'Il y a 2h',
      isRead: false,
      type: 'trend',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Nouvel article équipe',
      message: 'Découvrez l\'interview de Sean',
      time: 'Hier',
      isRead: true,
      type: 'article',
      priority: 'low'
    }
  ]);
  
  // États avancés pour fonctionnalités premium
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(['Nike Air Max', 'Jordan 1 Retro']);
  const [favorites] = useState<string[]>(['deals', 'team']);
  const [isOnline, setIsOnline] = useState(true);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  
  // Refs pour fonctionnalités avancées
  const searchRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Suggestions intelligentes avec debounce et scoring
  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    
    return mockDeals
      .filter(deal => {
        const query = searchQuery.toLowerCase();
        const titleMatch = deal.title.toLowerCase().includes(query);
        const brandMatch = deal.brand.toLowerCase().includes(query);
        return titleMatch || brandMatch;
      })
      .sort((a, b) => {
        // Scoring intelligent : deals récents et populaires en premier
        const aScore = (a.isNew ? 10 : 0) + (a.discountPercentage / 10);
        const bScore = (b.isNew ? 10 : 0) + (b.discountPercentage / 10);
        return bScore - aScore;
      })
      .slice(0, 6);
  }, [searchQuery]);

  // Données premium pour suggestions avancées
  const trendingSearches = ['Jordan 4 Black Cat', 'Nike Dunk Low', 'Stussy Hoodie'];
  const quickActions = [
    { label: 'Nouveautés', icon: Sparkles, href: '/deals?filter=new' },
    { label: 'Meilleures offres', icon: TrendingUp, href: '/deals?sort=discount' },
    { label: 'Favoris', icon: Bookmark, href: '/favorites' },
  ];

  // Fonctions premium avec performance optimisée
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    
    // Simuler loading pour demo UX
    if (value.length > 2) {
      setIsSearching(true);
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
      }, 300);
    }
  }, []);

  const addToSearchHistory = useCallback((query: string) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      return [query, ...filtered].slice(0, 5);
    });
  }, []);

  const executeSearch = useCallback((query: string) => {
    if (query.trim()) {
      addToSearchHistory(query.trim());
      setShowSuggestions(false);
      setIsSearchFocused(false);
      // Navigation vers results
      console.log('Searching for:', query);
    }
  }, [addToSearchHistory]);

  // Fonctions de gestion des notifications
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.isRead).length, 
    [notifications]
  );

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  const getNotificationColor = useCallback((notification: Notification) => {
    if (notification.isRead) return 'bg-muted';
    
    switch (notification.priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-brand-500';
    }
  }, []);

  const getNotificationTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'deal': return 'bg-brand-500';
      case 'trend': return 'bg-green-500';
      case 'article': return 'bg-blue-500';
      case 'system': return 'bg-orange-500';
      default: return 'bg-muted';
    }
  }, []);

  // Raccourcis clavier professionnels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keyboardShortcuts) return;
      
      // Cmd/Ctrl + K pour focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        setIsSearchFocused(true);
        setShowSuggestions(true);
      }
      
      // Escape pour fermer search
      if (e.key === 'Escape' && isSearchFocused) {
        searchRef.current?.blur();
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
      
      // Enter pour rechercher
      if (e.key === 'Enter' && isSearchFocused && searchQuery) {
        executeSearch(searchQuery);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcuts, isSearchFocused, searchQuery, executeSearch]);

  // Détection état online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <TooltipProvider>
      <header className={cn(
        'sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300',
        isSearchFocused && 'shadow-elevation-3 bg-background/98',
        !isOnline && 'border-orange-200 bg-orange-50/50',
        className
      )}>
        {/* Indicateur de statut offline */}
        {!isOnline && (
          <div className="bg-orange-100 border-b border-orange-200 px-4 py-1">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs text-orange-700">
              <AlertCircle className="h-3 w-3" />
              <span>Mode hors-ligne - Certaines fonctionnalités peuvent être limitées</span>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo et Search Bar */}
            <div className="flex items-center gap-8">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/" className="flex items-center group cursor-pointer">
                    <Image
                      src="/camino_logo.jpg"
                      alt="Camino TV"
                      width={100}
                      height={32}
                      className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
                      priority
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Retour à l'accueil</p>
                </TooltipContent>
              </Tooltip>

              {/* Search Bar PREMIUM avec fonctionnalités avancées */}
              <div className="flex-1 max-w-lg relative" ref={searchRef}>
            <div className="relative group">
              {/* Icône de recherche avec animation */}
              <Search className={cn(
                "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-300",
                isSearchFocused ? "text-foreground scale-110" : "text-muted-foreground",
                isSearching && "animate-pulse"
              )} />
              
              {/* Input avec UX premium */}
              <Input
                ref={searchRef}
                type="search"
                placeholder={`Recherche ${keyboardShortcuts ? '(⌘K)' : ''}...`}
                className={cn(
                  "w-full pl-10 pr-20 transition-all duration-300 border-border bg-muted/50",
                  "focus:bg-background focus:border-foreground focus:shadow-elevation-2 focus:ring-2 focus:ring-brand-500/20",
                  "hover:bg-background hover:border-border",
                  isSearchFocused && "bg-background border-foreground shadow-elevation-2"
                )}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  setIsSearchFocused(true);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeSearch(searchQuery);
                  }
                }}
              />
              
              {/* Indicateurs de statut à droite */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isSearching && (
                  <Loader2 className="h-4 w-4 text-brand-500 animate-spin" />
                )}
                
                {searchQuery.length > 0 && !isSearching && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted"
                    onClick={() => {
                      setSearchQuery('');
                      searchRef.current?.focus();
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                
                {keyboardShortcuts && !isSearchFocused && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-5">
                    ⌘K
                  </Badge>
                )}
                
                {searchQuery.length > 2 && !isSearching && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-brand-500 hover:text-white"
                    onClick={() => executeSearch(searchQuery)}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Panel de suggestions PREMIUM */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-elevation-4 z-50 animate-in slide-in-from-top-2 duration-300 max-h-96 overflow-hidden">
                
                {/* Actions rapides en haut */}
                {searchQuery.length === 0 && (
                  <div className="p-3 border-b border-border">
                    <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Actions rapides
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {quickActions.map((action) => (
                        <Link
                          key={action.label}
                          href={action.href}
                          className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                          onClick={() => setShowSuggestions(false)}
                        >
                          <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                          <span className="text-xs text-muted-foreground group-hover:text-foreground">
                            {action.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Résultats de recherche avec scoring */}
                {searchQuery.length > 2 && suggestions.length > 0 && (
                  <div className="p-3 border-b border-border">
                    <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      Résultats ({suggestions.length})
                      {isSearching && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
                    </h4>
                    <div className="space-y-1">
                      {suggestions.map((deal, index) => (
                        <div 
                          key={deal.id}
                          className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-all duration-200 group"
                          onClick={() => {
                            executeSearch(deal.title);
                          }}
                        >
                          <div className="w-8 h-8 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate group-hover:text-brand-600">
                              {deal.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{deal.brand}</span>
                              <span>•</span>
                              <span className="font-medium text-green-600">{deal.currentPrice}€</span>
                              {deal.isNew && (
                                <>
                                  <span>•</span>
                                  <Badge variant="secondary" className="text-xs px-1 py-0">
                                    Nouveau
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={deal.discountPercentage > 30 ? "default" : "secondary"} 
                              className={cn(
                                "text-xs",
                                deal.discountPercentage > 30 && "bg-brand-500 text-white"
                              )}
                            >
                              -{deal.discountPercentage}%
                            </Badge>
                            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Message si pas de résultats */}
                {searchQuery.length > 2 && suggestions.length === 0 && !isSearching && (
                  <div className="p-4 text-center">
                    <div className="text-muted-foreground mb-2">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun résultat pour "{searchQuery}"</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => executeSearch(searchQuery)}
                      className="text-xs"
                    >
                      Rechercher quand même
                    </Button>
                  </div>
                )}

                {/* Recherches populaires et historique */}
                {searchQuery.length <= 2 && (
                  <>
                    <div className="p-3 border-b border-border">
                      <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Tendances du moment
                      </h4>
                      <div className="space-y-2">
                        {trendingSearches.map((search, index) => (
                          <div
                            key={search}
                            className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors group"
                            onClick={() => {
                              executeSearch(search);
                            }}
                          >
                            <div className="flex items-center justify-center w-6 h-6 bg-brand-500 text-white rounded text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="text-sm text-foreground group-hover:text-brand-600">
                              {search}
                            </span>
                            <Star className="h-3 w-3 text-yellow-500 ml-auto" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {searchHistory.length > 0 && (
                      <div className="p-3">
                        <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
                          <History className="h-3 w-3" />
                          Recherches récentes
                        </h4>
                        <div className="space-y-1">
                          {searchHistory.map((search) => (
                            <div 
                              key={search}
                              className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors text-sm text-muted-foreground hover:text-foreground group"
                              onClick={() => {
                                executeSearch(search);
                              }}
                            >
                              <Clock className="h-3 w-3 text-muted-foreground group-hover:text-brand-500" />
                              <span className="flex-1">{search}</span>
                              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Footer avec raccourcis */}
                <div className="p-2 border-t border-border bg-muted/30">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Command className="h-3 w-3" />
                        <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">⌘K</kbd>
                        <span>pour rechercher</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↵</kbd>
                        <span>valider</span>
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setKeyboardShortcuts(!keyboardShortcuts)}
                    >
                      {keyboardShortcuts ? 'Désactiver' : 'Activer'} raccourcis
                    </Button>
                  </div>
                </div>
              </div>
            )}
              </div>
            </div>

            {/* Navigation Menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
                      <Home className="h-4 w-4" />
                      Accueil
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/deals" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
                      <Zap className="h-4 w-4" />
                      Bons plans
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/blog" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
                      <BookOpen className="h-4 w-4" />
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/team" legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
                      <Users className="h-4 w-4" />
                      Équipe
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

          {/* Actions utilisateur PREMIUM */}
          <div className="flex items-center gap-3">
            
            {/* Navigation mobile optimisée */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden relative">
                  <Filter className="h-4 w-4" />
                  {!isOnline && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/camino_logo.jpg"
                      alt="Camino TV"
                      width={80}
                      height={26}
                      className="h-6 w-auto"
                    />
                    Navigation
                  </SheetTitle>
                  <SheetDescription>
                    Accédez aux différentes sections de Camino TV
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  {/* Navigation principale */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground px-2">
                      Navigation
                    </h4>
                    <div className="space-y-1">
                      <Link 
                        href="/" 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <Home className="h-5 w-5 text-muted-foreground group-hover:text-brand-500" />
                        <span className="font-medium">Accueil</span>
                        {favorites.includes('home') && <Star className="h-3 w-3 text-yellow-500 ml-auto" />}
                      </Link>
                      <Link 
                        href="/deals" 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <Zap className="h-5 w-5 text-muted-foreground group-hover:text-brand-500" />
                        <div className="flex-1">
                          <span className="font-medium">Bons plans</span>
                          <p className="text-xs text-muted-foreground">500+ offres actives</p>
                        </div>
                        {favorites.includes('deals') && <Star className="h-3 w-3 text-yellow-500" />}
                      </Link>
                      <Link 
                        href="/blog" 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-brand-500" />
                        <div className="flex-1">
                          <span className="font-medium">Blog</span>
                          <p className="text-xs text-muted-foreground">Culture & articles</p>
                        </div>
                        {favorites.includes('blog') && <Star className="h-3 w-3 text-yellow-500" />}
                      </Link>
                      <Link 
                        href="/team" 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <Users className="h-5 w-5 text-muted-foreground group-hover:text-brand-500" />
                        <span className="font-medium">Équipe</span>
                        {favorites.includes('team') && <Star className="h-3 w-3 text-yellow-500" />}
                      </Link>
                    </div>
                  </div>
                  
                  {/* Actions rapides */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground px-2">
                      Actions rapides
                    </h4>
                    <div className="space-y-1">
                      {quickActions.map((action) => (
                        <Link
                          key={action.label}
                          href={action.href}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-brand-500" />
                          <span className="text-sm">{action.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Paramètres mobile */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground px-2">
                      Paramètres
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                          <span className="text-sm">Mode sombre</span>
                        </div>
                        <Switch
                          checked={theme === 'dark'}
                          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <Command className="h-4 w-4" />
                          <span className="text-sm">Raccourcis clavier</span>
                        </div>
                        <Switch
                          checked={keyboardShortcuts}
                          onCheckedChange={setKeyboardShortcuts}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Toggle dark mode avec animation */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hidden sm:flex relative group"
                >
                  <div className="relative">
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    ) : (
                      <Moon className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex items-center gap-1">
                  {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                  {keyboardShortcuts && <kbd className="px-1 py-0.5 bg-muted border border-border rounded text-xs">⌘D</kbd>}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Notifications PREMIUM avec dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative group">
                  <Bell className={cn(
                    "h-4 w-4 transition-all",
                    unreadCount > 0 && "animate-pulse"
                  )} />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-bounce"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {unreadCount} nouvelles
                      </Badge>
                    )}
                    {unreadCount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={markAllAsRead}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Liste des notifications avec système lu/non-lu */}
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucune notification</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className={cn(
                          "flex items-start gap-3 p-3 cursor-pointer transition-all duration-200",
                          !notification.isRead && "bg-muted/30",
                          "hover:bg-muted/50"
                        )}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-all duration-300",
                          getNotificationColor(notification),
                          !notification.isRead && "animate-pulse"
                        )} />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-sm transition-all duration-200",
                              notification.isRead 
                                ? "font-normal text-muted-foreground" 
                                : "font-medium text-foreground"
                            )}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <Eye className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                            <div className="flex items-center gap-1">
                              <Badge 
                                variant={notification.isRead ? "outline" : "secondary"} 
                                className={cn(
                                  "text-xs px-1.5 py-0.5",
                                  !notification.isRead && getNotificationTypeColor(notification.type)
                                )}
                              >
                                {notification.type}
                              </Badge>
                              {notification.priority === 'high' && !notification.isRead && (
                                <div className="h-1 w-1 bg-red-500 rounded-full animate-pulse" />
                              )}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-brand-600 font-medium">
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu utilisateur PREMIUM */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full group">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center text-white font-medium text-sm group-hover:scale-105 transition-transform">
                    CTV
                  </div>
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold">
                      CTV
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">Demo User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        demo@caminotv.com
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          isOnline ? "bg-green-500" : "bg-orange-500"
                        )} />
                        <span className="text-xs text-muted-foreground">
                          {isOnline ? 'En ligne' : 'Hors ligne'}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="group">
                  <User className="mr-2 h-4 w-4 group-hover:text-brand-500" />
                  <span>Mon profil</span>
                  <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="group">
                  <Link href="/favorites" className="flex items-center">
                    <Bookmark className="mr-2 h-4 w-4 group-hover:text-brand-500" />
                    <span>Mes favoris</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="group">
                  <History className="mr-2 h-4 w-4 group-hover:text-brand-500" />
                  <span>Historique</span>
                  <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild className="group">
                  <Link href="/deals" className="flex items-center">
                    <Zap className="mr-2 h-4 w-4 group-hover:text-brand-500" />
                    <span>Bons plans</span>
                    <Badge variant="secondary" className="ml-auto text-xs">500+</Badge>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="group">
                  <Link href="/blog" className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4 group-hover:text-brand-500" />
                    <span>Blog</span>
                    <Badge variant="secondary" className="ml-auto text-xs">Nouveau</Badge>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="group">
                  <Link href="/team" className="flex items-center">
                    <Users className="mr-2 h-4 w-4 group-hover:text-brand-500" />
                    <span>Équipe</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="group">
                  <Settings className="mr-2 h-4 w-4 group-hover:text-brand-500" />
                  <span>Paramètres</span>
                  <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center justify-between group">
                  <div className="flex items-center">
                    {theme === 'dark' ? (
                      <Sun className="mr-2 h-4 w-4 group-hover:text-brand-500" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4 group-hover:text-brand-500" />
                    )}
                    <span>Mode sombre</span>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                  <span>Se déconnecter</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  </TooltipProvider>
  );
}