import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Palette, Search, LogOut, Store, Heart, ShoppingCart } from "lucide-react";
import type { Design, ShopItem } from "@shared/schema";

export default function Marketplace() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: shopItems, isLoading } = useQuery<(ShopItem & { design: Design })[]>({
    queryKey: ["/api/marketplace"],
  });

  const filteredItems = shopItems?.filter(item =>
    item.design.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Link href="/designs" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-my-designs">
              Mes Créations
            </Link>
            <Link href="/marketplace" className="text-sm font-medium text-primary" data-testid="link-marketplace">
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
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Découvrez les créations d'autres designers et achetez des designs uniques
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher dans la marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-t-lg" />
                <div className="p-4 bg-card rounded-b-lg">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-marketplace">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover-elevate group" data-testid={`card-item-${item.id}`}>
                {/* Preview */}
                <div className="aspect-square bg-muted relative">
                  {item.design.previewImageUrl ? (
                    <img 
                      src={item.design.previewImageUrl} 
                      alt={item.design.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <Button className="w-full" data-testid={`button-buy-${item.id}`}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Acheter
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-heading font-semibold mb-1 truncate" data-testid={`text-item-name-${item.id}`}>
                    {item.design.name}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-heading font-bold text-primary" data-testid={`text-item-price-${item.id}`}>
                      {parseFloat(item.price).toFixed(2)} €
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span>{item.design.likes}</span>
                    </div>
                  </div>
                  {item.stock > 0 ? (
                    <p className="text-xs text-muted-foreground">En stock ({item.stock})</p>
                  ) : (
                    <p className="text-xs text-destructive">Rupture de stock</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Store className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Aucun produit disponible</h3>
            <p className="text-muted-foreground">
              Revenez plus tard pour découvrir de nouvelles créations
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
