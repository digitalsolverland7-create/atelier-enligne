import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette, Search, LogOut } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function Products() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Fetch products
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.categoryId === categoryFilter;
    return matchesSearch && matchesCategory && product.isActive;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price-asc") return parseFloat(a.basePrice) - parseFloat(b.basePrice);
    if (sortBy === "price-desc") return parseFloat(b.basePrice) - parseFloat(a.basePrice);
    return 0;
  }) || [];

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
            <Link href="/products" className="text-sm font-medium text-primary" data-testid="link-products">
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
          <h1 className="text-4xl font-heading font-bold mb-2">Catalogue de produits</h1>
          <p className="text-lg text-muted-foreground">
            Choisissez un produit et personnalisez-le avec notre éditeur 3D
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-category">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="clothing">Vêtements</SelectItem>
              <SelectItem value="accessories">Accessoires</SelectItem>
              <SelectItem value="home">Maison</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48" data-testid="select-sort">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom A-Z</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-t-lg" />
                <div className="p-4 bg-card rounded-b-lg">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-products">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Palette className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos filtres de recherche
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
