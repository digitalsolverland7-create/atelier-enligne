import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Palette } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate group" data-testid={`card-product-${product.id}`}>
      {/* Product Image */}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {product.previewImageUrl ? (
          <img 
            src={product.previewImageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <Button className="w-full" asChild data-testid={`button-customize-${product.id}`}>
            <Link href={`/atelier/${product.id}`}>
              <Palette className="w-4 h-4 mr-2" />
              Personnaliser
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-lg mb-1" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-heading font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            {parseFloat(product.basePrice).toFixed(2)} €
          </span>
          
          {/* Available colors preview */}
          {Array.isArray(product.availableColors) && product.availableColors.length > 0 && (
            <div className="flex gap-1">
              {product.availableColors.slice(0, 4).map((color, index) => (
                <div 
                  key={index}
                  className="w-5 h-5 rounded-full border-2 border-background shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.availableColors.length > 4 && (
                <div className="w-5 h-5 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                  +{product.availableColors.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
