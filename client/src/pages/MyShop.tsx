import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Palette, LogOut, Store, Plus, Settings, TrendingUp } from "lucide-react";
import type { ShopItem, Design } from "@shared/schema";

export default function MyShop() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [shopName, setShopName] = useState(user?.shopName || "");
  const [shopDescription, setShopDescription] = useState(user?.shopDescription || "");

  const { data: shopItems, isLoading } = useQuery<(ShopItem & { design: Design })[]>({
    queryKey: ["/api/shop/my-items"],
  });

  const updateShopMutation = useMutation({
    mutationFn: async (data: { shopName: string; shopDescription: string }) => {
      return await apiRequest("PUT", "/api/shop/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Boutique mise à jour",
        description: "Vos paramètres de boutique ont été sauvegardés.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la boutique.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateShop = () => {
    updateShopMutation.mutate({ shopName, shopDescription });
  };

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
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-marketplace">
              Marketplace
            </Link>
            <Link href="/shop" className="text-sm font-medium text-primary" data-testid="link-my-shop">
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
            <h1 className="text-4xl font-heading font-bold mb-2">Ma Boutique</h1>
            <p className="text-lg text-muted-foreground">
              Gérez vos produits et vos ventes
            </p>
          </div>
          <Button asChild data-testid="button-add-item">
            <Link href="/designs">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un produit
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Shop Settings */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-heading font-bold">Paramètres de la boutique</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nom de la boutique</label>
                  <Input
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Ma boutique"
                    data-testid="input-shop-name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    placeholder="Décrivez votre boutique..."
                    rows={4}
                    data-testid="textarea-shop-description"
                  />
                </div>

                <Button 
                  onClick={handleUpdateShop}
                  disabled={updateShopMutation.isPending}
                  data-testid="button-save-shop"
                >
                  Sauvegarder les modifications
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Produits en vente</span>
                <Store className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-heading font-bold" data-testid="text-items-count">
                {shopItems?.length || 0}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Ventes totales</span>
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-heading font-bold" data-testid="text-sales-count">0</div>
            </Card>
          </div>
        </div>

        {/* Shop Items */}
        <div>
          <h2 className="text-2xl font-heading font-bold mb-6">Mes produits en vente</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-t-lg" />
                  <div className="p-4 bg-card rounded-b-lg">
                    <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : shopItems && shopItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-shop-items">
              {shopItems.map((item) => (
                <Card key={item.id} className="overflow-hidden" data-testid={`card-shop-item-${item.id}`}>
                  <div className="aspect-square bg-muted">
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
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold mb-2">{item.design.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-heading font-bold text-primary">
                        {parseFloat(item.price).toFixed(2)} €
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Stock: {item.stock}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Store className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">Aucun produit en vente</h3>
              <p className="text-muted-foreground mb-6">
                Ajoutez vos créations à votre boutique pour commencer à vendre
              </p>
              <Button asChild data-testid="button-add-first-item">
                <Link href="/designs">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter mon premier produit
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
