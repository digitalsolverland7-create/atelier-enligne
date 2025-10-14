import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Palette, Search, LogOut, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import type { Design } from "@shared/schema";

export default function MyDesigns() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: designs, isLoading } = useQuery<Design[]>({
    queryKey: ["/api/designs/my"],
  });

  const filteredDesigns = designs?.filter(design => 
    design.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            <span className="text-xl font-heading font-bold">Atelier Enligne</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-products">
              Produits
            </Link>
            <Link href="/designs" className="text-sm font-medium text-primary" data-testid="link-my-designs">
              Mes Créations
            </Link>
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-marketplace">
              Marketplace
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-my-shop">
              Ma Boutique
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {user?.profileImageUrl && (
              <img 
                src={user.profileImageUrl} 
                alt={user.firstName || "User"} 
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <Button variant="ghost" size="sm" asChild data-testid="button-logout">
              <a href="/api/logout">
                <LogOut className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold mb-2">Mes Créations</h1>
            <p className="text-lg text-muted-foreground">
              Gérez tous vos designs personnalisés
            </p>
          </div>
          <Button asChild data-testid="button-create-new">
            <Link href="/products">
              <Plus className="w-4 h-4 mr-2" />
              Créer un design
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher dans mes créations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Designs Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-t-lg" />
                <div className="p-4 bg-card rounded-b-lg">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDesigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-designs">
            {filteredDesigns.map((design) => (
              <Card key={design.id} className="overflow-hidden hover-elevate group" data-testid={`card-design-${design.id}`}>
                {/* Preview */}
                <div className="aspect-square bg-muted relative">
                  {design.previewImageUrl ? (
                    <img 
                      src={design.previewImageUrl} 
                      alt={design.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Palette className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                    <Button size="sm" variant="secondary" className="flex-1" asChild>
                      <Link href={`/designs/${design.id}`}>
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Voir
                      </Link>
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/atelier/${design.productId}?design=${design.id}`}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-heading font-semibold mb-1 truncate" data-testid={`text-design-name-${design.id}`}>
                    {design.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{new Date(design.createdAt).toLocaleDateString()}</span>
                    {design.isPublic && (
                      <span className="text-primary">Public</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Palette className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Aucune création</h3>
            <p className="text-muted-foreground mb-6">
              Commencez à créer vos produits personnalisés
            </p>
            <Button asChild data-testid="button-start-creating">
              <Link href="/products">
                <Plus className="w-4 h-4 mr-2" />
                Créer mon premier design
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
