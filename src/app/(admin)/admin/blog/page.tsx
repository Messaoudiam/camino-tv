'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Calendar } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockBlogPosts } from '@/data/mock'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'

/**
 * Blog Management Page
 * Displays blog posts from mockBlogPosts
 * Full CRUD can be implemented later with Prisma BlogPost model
 */
export default function BlogPage() {
  const [posts] = useState(mockBlogPosts)

  const categoryColors: Record<string, string> = {
    culture: 'bg-purple-500/10 text-purple-600 border-purple-200',
    streetwear: 'bg-blue-500/10 text-blue-600 border-blue-200',
    musique: 'bg-green-500/10 text-green-600 border-green-200',
    interview: 'bg-orange-500/10 text-orange-600 border-orange-200',
    lifestyle: 'bg-pink-500/10 text-pink-600 border-pink-200',
    tendances: 'bg-red-500/10 text-red-600 border-red-200',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion du Blog</h1>
          <p className="text-muted-foreground">
            Gérez les articles et contenus de votre blog
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles de blog ({posts.length})</CardTitle>
          <CardDescription>
            Articles actuellement en mode lecture seule (mockBlogPosts). Intégration Prisma disponible pour CRUD complet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Vues</TableHead>
                  <TableHead>Commentaires</TableHead>
                  <TableHead>Publié le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="h-12 w-20 rounded object-cover"
                        />
                        <div className="max-w-[300px]">
                          <div className="font-medium truncate">{post.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={categoryColors[post.category] || 'bg-gray-500/10'}
                      >
                        {post.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <div className="text-sm">
                          {post.author.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Eye className="h-4 w-4" />
                        {(post as any).views?.toLocaleString() || '0'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{(post as any).comments || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(post.publishedAt), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <h3 className="font-semibold mb-2">💡 Note : CRUD complet disponible</h3>
            <p className="text-sm text-muted-foreground">
              Le modèle <code className="bg-background px-1.5 py-0.5 rounded">BlogPost</code> est déjà défini dans Prisma.
              Pour implémenter le CRUD complet (créer, modifier, supprimer), il suffit de :
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4 list-disc">
              <li>Créer les API routes <code className="bg-background px-1.5 py-0.5 rounded">/api/blog</code></li>
              <li>Ajouter un formulaire BlogForm similaire à DealForm</li>
              <li>Remplacer mockBlogPosts par des données Prisma</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
