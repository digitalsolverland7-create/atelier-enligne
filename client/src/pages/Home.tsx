import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Palette, 
  Box, 
  ShoppingBag, 
  Store, 
  Package, 
  TrendingUp,
  LogOut,
  Sparkles
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            <span className="text-xl font-heading font-bold">Atelier Enligne</span>
          </div>
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
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-my-shop">
              Ma Boutique
            </Link>
            <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-orders">
              Commandes
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {user?.profileImageUrl && (
              <img 
                src={user.profileImageUrl} 
                alt={user.firstName || "User"} 
                className="w-8 h-8 rounded-full object-cover"
                data-testid="img-user-avatar"
              />
            )}
            <span className="text-sm font-medium hidden md:inline" data-testid="text-user-name">
              {user?.firstName || user?.email}
            </span>
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
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-heading font-bold mb-2">
            Bienvenue, {user?.firstName || "Créateur"} !
          </h1>
          <p className="text-lg text-muted-foreground">
            Commencez à créer des produits personnalisés ou gérez votre boutique
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover-elevate cursor-pointer" asChild data-testid="card-create-design">
            <Link href="/products">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Créer un Design</h3>
              <p className="text-muted-foreground mb-4">
                Personnalisez un produit avec notre éditeur 3D
              </p>
              <Button className="w-full" data-testid="button-start-creating">
                Commencer
              </Button>
            </Link>
          </Card>

          <Card className="p-6 hover-elevate cursor-pointer" asChild data-testid="card-my-designs">
            <Link href="/designs">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Mes Créations</h3>
              <p className="text-muted-foreground mb-4">
                Accédez à tous vos designs sauvegardés
              </p>
              <Button variant="outline" className="w-full" data-testid="button-view-designs">
                Voir mes designs
              </Button>
            </Link>
          </Card>

          <Card className="p-6 hover-elevate cursor-pointer" asChild data-testid="card-my-shop">
            <Link href="/shop">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">Ma Boutique</h3>
              <p className="text-muted-foreground mb-4">
                Vendez vos créations sur la marketplace
              </p>
              <Button variant="outline" className="w-full" data-testid="button-manage-shop">
                Gérer ma boutique
              </Button>
            </Link>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Mes Designs</span>
              <Box className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-heading font-bold" data-testid="text-designs-count">0</div>
            <p className="text-xs text-muted-foreground mt-1">Créations sauvegardées</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Commandes</span>
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-heading font-bold" data-testid="text-orders-count">0</div>
            <p className="text-xs text-muted-foreground mt-1">Commandes passées</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Ventes</span>
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-heading font-bold" data-testid="text-sales-count">0</div>
            <p className="text-xs text-muted-foreground mt-1">Produits vendus</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Articles en boutique</span>
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-heading font-bold" data-testid="text-shop-items-count">0</div>
            <p className="text-xs text-muted-foreground mt-1">Produits en vente</p>
          </Card>
        </div>

        {/* Explore Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
            <h3 className="text-2xl font-heading font-bold mb-3">Explorer le catalogue</h3>
            <p className="text-muted-foreground mb-6">
              Découvrez plus de 50 produits personnalisables : vêtements, accessoires, décoration et plus encore.
            </p>
            <Button asChild data-testid="button-browse-products">
              <Link href="/products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Parcourir les produits
              </Link>
            </Button>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-accent/10 to-accent/5">
            <h3 className="text-2xl font-heading font-bold mb-3">Marketplace</h3>
            <p className="text-muted-foreground mb-6">
              Découvrez les créations d'autres designers et trouvez l'inspiration pour vos propres designs.
            </p>
            <Button variant="outline" asChild data-testid="button-explore-marketplace">
              <Link href="/marketplace">
                <Store className="w-4 h-4 mr-2" />
                Explorer la marketplace
              </Link>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
