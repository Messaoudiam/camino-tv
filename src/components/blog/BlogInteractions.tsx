'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import { BlogPost } from '@/types';

interface BlogInteractionsProps {
  post: BlogPost;
}

export function BlogInteractions({ post }: BlogInteractionsProps) {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShareMenuOpen(!shareMenuOpen)}
        className="hover:bg-brand-50 dark:hover:bg-brand-950/50"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Partager
      </Button>
      
      {shareMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-10">
          <div className="p-2 space-y-1">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}&via=CaminoTV`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
              onClick={() => setShareMenuOpen(false)}
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
              onClick={() => setShareMenuOpen(false)}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors w-full text-left hover:bg-muted cursor-pointer"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
              {copied ? 'Copié!' : 'Copier le lien'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}