'use client';

/**
 * Header component - Navigation principale du site
 */

import { 
  Sparkles, TrendingUp, Moon, Sun, 
  Menu, Users, Home, Zap, AlertCircle, Bookmark, BookOpen, Mail
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { HeaderProps } from '@/types';
import { cn } from '@/lib/utils';

export function Header({ className }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  
  // États utilisés
  const [isSearchFocused] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

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
            
            {/* Logo */}
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

          {/* Actions utilisateur PREMIUM */}
          <div className="flex items-center gap-3">
            {/* Navigation Menu */}
            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Accueil
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/deals" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Bons plans
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/favorites" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Favoris
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/blog" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Blog
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Équipe
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/contact" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact
                </Link>
              </Button>
            </div>
            
            {/* Toggle dark mode mobile */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="md:hidden relative group p-2 cursor-pointer hover:bg-transparent"
                >
                  <div className="relative">
                    {theme === 'dark' ? (
                      <Sun className="h-7 w-7 transition-transform group-hover:rotate-180" />
                    ) : (
                      <Moon className="h-7 w-7 transition-transform group-hover:-rotate-12" />
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Navigation mobile optimisée */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden relative group p-2">
                  <Menu className="h-7 w-7 transition-transform group-hover:scale-110" />
                  {!isOnline && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
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
                  <div className="space-y-1">
                    <Link 
                      href="/" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <Home className="h-4 w-4" />
                      <span>Accueil</span>
                    </Link>
                    <Link 
                      href="/deals" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Bons plans</span>
                    </Link>
                    <Link 
                      href="/favorites" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>Favoris</span>
                    </Link>
                    <Link 
                      href="/blog" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Blog</span>
                    </Link>
                    <Link 
                      href="/team" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <Users className="h-4 w-4" />
                      <span>Équipe</span>
                    </Link>
                    <Link 
                      href="/contact" 
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Contact</span>
                    </Link>
                  </div>

                  {/* Séparateur */}
                  <div className="border-t border-border"></div>

                  {/* Actions rapides */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground px-3">
                      Accès rapide
                    </h4>
                    <div className="space-y-1">
                      <Link 
                        href="/deals?filter=new" 
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group text-sm"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Nouveautés</span>
                      </Link>
                      <Link 
                        href="/deals?sort=discount" 
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group text-sm"
                      >
                        <TrendingUp className="h-4 w-4" />
                        <span>Meilleures offres</span>
                      </Link>
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
                  className="hidden sm:flex relative group cursor-pointer hover:bg-transparent"
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
                <p>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  </TooltipProvider>
  );
}