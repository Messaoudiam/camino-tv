'use client';

import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/20 to-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Notre Équipe
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rencontrez les personnes passionnées qui font de Camino TV une plateforme unique pour dénicher les meilleurs deals.
          </p>
        </div>

        {/* Équipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Sean */}
          <Card className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-xl">
                <Image
                  src="/sean.jpeg"
                  alt="Sean"
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-xl"
                  priority
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground">Sean</h3>
              </div>
            </CardContent>
          </Card>

          {/* Piway */}
          <Card className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-xl">
                <Image
                  src="/piway.jpeg"
                  alt="Piway"
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-xl"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground">Piway</h3>
              </div>
            </CardContent>
          </Card>

          {/* Keusmo */}
          <Card className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-xl">
                <Image
                  src="/keusmo.jpeg"
                  alt="Keusmo"
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-xl"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground">Keusmo</h3>
              </div>
            </CardContent>
          </Card>

          {/* Monroe */}
          <Card className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-xl">
                <Image
                  src="/monroe.jpeg"
                  alt="Monroe"
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-xl"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground">Monroe</h3>
              </div>
            </CardContent>
          </Card>

          {/* Mike */}
          <Card className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-xl">
                <Image
                  src="/mike.jpeg"
                  alt="Mike"
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-xl"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground">Mike</h3>
              </div>
            </CardContent>
          </Card>

          {/* Elssy */}
          <Card className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-xl">
                <Image
                  src="/elssy.jpeg"
                  alt="Elssy"
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-xl"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground">Elssy</h3>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}