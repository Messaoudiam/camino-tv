'use client';

import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import { BlogPost } from '@/types';
import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  post: BlogPost;
}

export function ShareButtons({ post }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Get current URL on client side
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl || `https://camino-tv.vercel.app/blog/${post.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl || `https://camino-tv.vercel.app/blog/${post.slug}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl || `https://camino-tv.vercel.app/blog/${post.slug}`)}&via=CaminoTV`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl || `https://camino-tv.vercel.app/blog/${post.slug}`)}`;
    window.open(url, '_blank', 'width=580,height=296');
  };

  return (
    <div className="flex items-center gap-3" role="group" aria-label="Boutons de partage social">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 transition-colors focus:ring-2 focus:ring-offset-2 hover:bg-muted cursor-pointer"
        onClick={handleTwitterShare}
        aria-label={`Partager "${post.title}" sur Twitter`}
      >
        <Twitter className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="gap-2 transition-colors focus:ring-2 focus:ring-offset-2 hover:bg-muted cursor-pointer"
        onClick={handleFacebookShare}
        aria-label={`Partager "${post.title}" sur Facebook`}
      >
        <Facebook className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="gap-2 transition-colors focus:ring-2 focus:ring-offset-2 hover:bg-muted cursor-pointer"
        onClick={handleCopy}
        aria-label="Copier le lien de l'article"
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <LinkIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">
          {copied ? 'Copié!' : 'Copier le lien'}
        </span>
      </Button>
    </div>
  );
}