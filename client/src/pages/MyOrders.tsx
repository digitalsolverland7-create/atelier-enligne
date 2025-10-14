import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Palette, LogOut, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Order } from "@shared/schema";

export default function MyOrders() {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/my"],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'delivered': return 'default';
      case 'shipped': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'in_production': 'En production',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée',
    };
    return labels[status] || status;
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
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-my-shop">
              Ma Boutique
            </Link>
            <Link href="/orders" className="text-sm font-medium text-primary" data-testid="link-orders">
              Commandes
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
          <h1 className="text-4xl font-heading font-bold mb-2">Mes Commandes</h1>
          <p className="text-lg text-muted-foreground">
            Suivez l'état de toutes vos commandes
          </p>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4" data-testid="list-orders">
            {orders.map((order) => (
              <Card key={order.id} className="p-6" data-testid={`card-order-${order.id}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-heading font-semibold" data-testid={`text-order-id-${order.id}`}>
                          Commande #{order.id.substring(0, 8)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantité:</span>
                        <span className="ml-2 font-medium">{order.quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total:</span>
                        <span className="ml-2 font-medium text-primary">
                          {parseFloat(order.totalPrice).toFixed(2)} €
                        </span>
                      </div>
                      {order.trackingNumber && (
                        <div>
                          <span className="text-muted-foreground">Suivi:</span>
                          <span className="ml-2 font-mono text-xs">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusColor(order.status)} className="gap-1.5" data-testid={`badge-status-${order.id}`}>
                      {getStatusIcon(order.status)}
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Aucune commande</h3>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore passé de commande
            </p>
            <Button asChild data-testid="button-browse-marketplace">
              <Link href="/marketplace">
                <Package className="w-4 h-4 mr-2" />
                Explorer la marketplace
              </Link>
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
