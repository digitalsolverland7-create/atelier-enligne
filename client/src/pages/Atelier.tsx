import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Save, 
  Share2, 
  ArrowLeft, 
  Palette,
  Type,
  Image as ImageIcon,
  Shapes,
  Layers,
  Settings,
  Box
} from "lucide-react";
import type { Product, Design, DesignElement } from "@shared/schema";
import { Scene3D } from "@/components/atelier/Scene3D";
import { ToolPanel } from "@/components/atelier/ToolPanel";
import { LayerPanel } from "@/components/atelier/LayerPanel";
import { PropertyPanel } from "@/components/atelier/PropertyPanel";

export default function Atelier() {
  const { productId } = useParams<{ productId: string }>();
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // State
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [productColor, setProductColor] = useState("#ffffff");
  const [designName, setDesignName] = useState("Mon Design");
  const [currentTextureArea, setCurrentTextureArea] = useState("front");
  const [showLayers, setShowLayers] = useState(true);
  const [showProperties, setShowProperties] = useState(true);

  // Fetch product
  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (elements.length > 0 && isAuthenticated) {
        handleSaveDraft();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [elements, isAuthenticated]);

  // Save design mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/designs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/designs"] });
      toast({
        title: "Design sauvegardé",
        description: "Votre création a été enregistrée avec succès.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Non authentifié",
          description: "Vous devez être connecté. Redirection...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le design.",
        variant: "destructive",
      });
    },
  });

  const handleSaveDraft = useCallback(() => {
    if (!product || !isAuthenticated) return;
    
    saveMutation.mutate({
      productId: product.id,
      name: designName,
      productColor,
      textureAreaId: currentTextureArea,
      elements,
      isPublic: false,
    });
  }, [product, designName, productColor, currentTextureArea, elements, isAuthenticated]);

  const handleSaveAndPublish = useCallback(() => {
    if (!product || !isAuthenticated) return;
    
    saveMutation.mutate({
      productId: product.id,
      name: designName,
      productColor,
      textureAreaId: currentTextureArea,
      elements,
      isPublic: true,
    });
  }, [product, designName, productColor, currentTextureArea, elements, isAuthenticated]);

  const handleAddElement = useCallback((element: DesignElement) => {
    setElements(prev => [...prev, element]);
    setSelectedElementId(element.id);
  }, []);

  const handleUpdateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  const selectedElement = elements.find(el => el.id === selectedElementId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour accéder à l'atelier.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [authLoading, isAuthenticated, toast]);

  if (authLoading || productLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Box className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Chargement de l'atelier...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Produit non trouvé</p>
          <Button onClick={() => navigate("/products")} data-testid="button-back-to-products">
            Retour aux produits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-card">
      {/* Top Bar */}
      <header className="h-16 border-b bg-background flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/products")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-heading font-semibold" data-testid="text-design-name">{designName}</h1>
            <p className="text-xs text-muted-foreground">{product.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSaveDraft}
            disabled={saveMutation.isPending}
            data-testid="button-save-draft"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button 
            size="sm"
            onClick={handleSaveAndPublish}
            disabled={saveMutation.isPending}
            data-testid="button-publish"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Publier
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tools */}
        <aside className="w-64 border-r bg-sidebar overflow-y-auto shrink-0">
          <ToolPanel 
            onAddElement={handleAddElement}
            productColor={productColor}
            onColorChange={setProductColor}
            availableColors={Array.isArray(product.availableColors) ? product.availableColors : []}
          />
        </aside>

        {/* Center - 3D Canvas */}
        <main className="flex-1 bg-card flex flex-col">
          <Scene3D 
            product={product}
            elements={elements}
            productColor={productColor}
            currentTextureArea={currentTextureArea}
          />
          
          {/* Bottom Bar - Texture Area Selector */}
          <div className="h-14 border-t bg-background flex items-center px-4 gap-2 shrink-0">
            <span className="text-sm font-medium mr-2">Zone:</span>
            {Array.isArray(product.textureAreas) && product.textureAreas.map((area: any) => (
              <Button
                key={area.id}
                variant={currentTextureArea === area.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTextureArea(area.id)}
                data-testid={`button-area-${area.id}`}
              >
                {area.name}
              </Button>
            ))}
          </div>
        </main>

        {/* Right Panel - Layers & Properties */}
        <aside className="w-80 border-l bg-sidebar overflow-y-auto shrink-0">
          <div className="p-4 space-y-4">
            {/* Layers Panel */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Calques
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLayers(!showLayers)}
                  data-testid="button-toggle-layers"
                >
                  {showLayers ? "Masquer" : "Afficher"}
                </Button>
              </div>
              {showLayers && (
                <LayerPanel
                  elements={elements}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                  onDeleteElement={handleDeleteElement}
                  onUpdateElement={handleUpdateElement}
                />
              )}
            </div>

            {/* Properties Panel */}
            {selectedElement && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Propriétés
                  </h3>
                </div>
                <PropertyPanel
                  element={selectedElement}
                  onUpdate={(updates) => handleUpdateElement(selectedElement.id, updates)}
                />
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
