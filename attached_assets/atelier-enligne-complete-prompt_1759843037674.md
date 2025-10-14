# Prompt Complet pour Atelier Enligne - Documentation Technique Exhaustive

## 🎯 Vision du Projet

**Atelier Enligne** est une plateforme web de personnalisation et d'impression de produits physiques avec visualisation 3D en temps réel. La plateforme permet aux utilisateurs de créer des designs personnalisés, de les visualiser sur des produits 3D réalistes, de passer commande, et même de revendre leurs créations via une boutique intégrée.

### Objectif Business
- Capter des clients via réseaux sociaux (Facebook, Instagram, etc.)
- Les diriger vers la plateforme pour créer leurs produits personnalisés
- Offrir une expérience de création fluide et professionnelle
- Permettre aux utilisateurs de devenir revendeurs (marketplace intégrée)

---

## 🏗️ Architecture Technique

### Stack Technologique Principal

```
Frontend:
- React 18+ avec TypeScript
- Vite (build tool - rapide et moderne)
- React Router v6 (navigation)
- Tailwind CSS (styling responsive)
- Zustand (state management - simple et performant)

3D Engine:
- Babylon.js (rendu 3D principal)
- @babylonjs/core
- @babylonjs/loaders
- @babylonjs/materials

Manipulation 2D/Design:
- Fabric.js (manipulation canvas 2D avant application 3D)
- react-dropzone (upload de fichiers)
- react-color (color picker)

Storage:
- localStorage/sessionStorage (phase 1)
- Architecture prête pour Supabase (phase 2)

Utilitaires:
- axios (requêtes HTTP)
- date-fns (manipulation dates)
- react-hot-toast (notifications)
- framer-motion (animations fluides)
- react-share (partage réseaux sociaux)
- html2canvas (capture screenshots pour partage)
```

### Structure du Projet

```
atelier-enligne/
├── public/
│   ├── models/           # Modèles 3D (.glb, .babylon)
│   ├── textures/         # Textures de base
│   └── assets/           # Images, icônes
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── Toast.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── GuestPrompt.tsx
│   │   ├── products/
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── ProductDetail.tsx
│   │   ├── atelier/
│   │   │   ├── AtelierCanvas.tsx
│   │   │   ├── Scene3D.tsx
│   │   │   ├── DesignControls.tsx
│   │   │   ├── ToolPanel.tsx
│   │   │   ├── LayerPanel.tsx
│   │   │   ├── TextTool.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── ViewControls.tsx
│   │   │   └── SavePanel.tsx
│   │   ├── shop/
│   │   │   ├── MyShop.tsx
│   │   │   ├── ShopSettings.tsx
│   │   │   ├── ProductListing.tsx
│   │   │   ├── PublicShop.tsx
│   │   │   └── ShopStats.tsx
│   │   ├── orders/
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── OrderTracking.tsx
│   │   │   └── Checkout.tsx
│   │   ├── social/
│   │   │   ├── ShareButtons.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── LikeButton.tsx
│   │   │   └── SocialPreview.tsx
│   │   └── gallery/
│   │       ├── DesignGallery.tsx
│   │       ├── GalleryCard.tsx
│   │       └── GalleryFilters.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── Atelier.tsx
│   │   ├── MyDesigns.tsx
│   │   ├── MyOrders.tsx
│   │   ├── MyShop.tsx
│   │   ├── Shop.tsx
│   │   ├── ShopDetail.tsx
│   │   ├── DesignDetail.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── designStore.ts
│   │   ├── productStore.ts
│   │   ├── cartStore.ts
│   │   ├── shopStore.ts
│   │   └── uiStore.ts
│   ├── services/
│   │   ├── storage.service.ts
│   │   ├── auth.service.ts
│   │   ├── design.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── shop.service.ts
│   │   ├── babylon.service.ts
│   │   └── export.service.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDesign.ts
│   │   ├── use3DScene.ts
│   │   ├── useLocalStorage.ts
│   │   └── useAutoSave.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── imageProcessor.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.types.ts
│   │   ├── design.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   └── shop.types.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 📋 Types TypeScript Fondamentaux

```typescript
// types/user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  shopName?: string;
  avatar?: string;
  createdAt: string;
  isGuest: boolean;
}

// types/product.types.ts
export enum ProductCategory {
  CLOTHING = 'clothing',
  ACCESSORIES = 'accessories',
  HOME = 'home',
  CUSTOM = 'custom'
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  modelPath: string;
  textureAreas: TextureArea[];
  availableColors: string[];
  sizes?: string[];
  description: string;
  previewImage: string;
}

export interface TextureArea {
  id: string;
  name: string;
  uvMapping: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  maxDesignSize: {
    width: number;
    height: number;
  };
  canvasSize: {
    width: number;
    height: number;
  };
}

// types/design.types.ts
export type DesignElementType = 'image' | 'text' | 'shape';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DesignElement {
  id: string;
  type: DesignElementType;
  position: Position;
  size?: Size;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
}

export interface ImageElement extends DesignElement {
  type: 'image';
  imageData: string;
  originalFile?: File;
  filters?: ImageFilters;
}

export interface TextElement extends DesignElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
}

export interface ShapeElement extends DesignElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'star';
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: boolean;
  sepia: boolean;
}

export interface Design {
  id: string;
  userId: string;
  productId: string;
  productColor: string;
  productSize?: string;
  textureAreaId: string;
  elements: (ImageElement | TextElement | ShapeElement)[];
  preview: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  name: string;
}

// types/order.types.ts
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PRODUCTION = 'in_production',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface Order {
  id: string;
  userId: string;
  designId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress?: Address;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

// types/shop.types.ts
export interface ShopItem {
  id: string;
  sellerId: string;
  designId: string;
  price: number;
  stock: number;
  views: number;
  likes: number;
  isActive: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  designId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}
```

---

## 🎨 Module Atelier - Implémentation Complète

### 1. Composant Principal AtelierCanvas

```typescript
// pages/Atelier.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Scene3D from '../components/atelier/Scene3D';
import ToolPanel from '../components/atelier/ToolPanel';
import LayerPanel from '../components/atelier/LayerPanel';
import PropertyPanel from '../components/atelier/PropertyPanel';
import ViewControls from '../components/atelier/ViewControls';
import SavePanel from '../components/atelier/SavePanel';
import { useDesignStore } from '../stores/designStore';
import { useProductStore } from '../stores/productStore';
import { useAutoSave } from '../hooks/useAutoSave';

const Atelier: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const {
    currentDesign,
    selectedElement,
    initializeDesign,
    addElement,
    updateElement,
    removeElement,
    selectElement,
    saveDesign
  } = useDesignStore();

  const { getProduct } = useProductStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentTextureArea, setCurrentTextureArea] = useState<string>('front');
  const [isLoading, setIsLoading] = useState(true);

  // Auto-save toutes les 30 secondes
  useAutoSave(currentDesign, 30000);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        navigate('/products');
        return;
      }

      const prod = await getProduct(productId);
      if (!prod) {
        navigate('/products');
        return;
      }

      setProduct(prod);
      initializeDesign(productId, prod.textureAreas[0].id);
      setIsLoading(false);
    };

    loadProduct();
  }, [productId]);

  const handleElementAdd = useCallback((element: DesignElement) => {
    addElement(currentTextureArea, element);
  }, [currentTextureArea, addElement]);

  const handleElementUpdate = useCallback((id: string, updates: Partial<DesignElement>) => {
    updateElement(currentTextureArea, id, updates);
  }, [currentTextureArea, updateElement]);

  const handleElementRemove = useCallback((id: string) => {
    removeElement(currentTextureArea, id);
  }, [currentTextureArea, removeElement]);

  const handleSave = async () => {
    try {
      await saveDesign(currentDesign);
      toast.success('Design sauvegardé avec succès!');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleTextureAreaChange = (areaId: string) => {
    setCurrentTextureArea(areaId);
  };

  if (isLoading || !product) {
    return <Loader message="Chargement de l'atelier..." />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/products')} className="text-gray-600 hover:text-gray-900">
            ← Retour
          </button>
          <h1 className="text-xl font-bold">Atelier de Création</h1>
          <span className="text-sm text-gray-500">{product.name}</span>
        </div>
        <SavePanel onSave={handleSave} />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Tools */}
        <aside className="w-64 bg-white border-r overflow-y-auto">
          <ToolPanel 
            onAddElement={handleElementAdd}
            currentProduct={product}
          />
          <LayerPanel
            elements={currentDesign?.elements[currentTextureArea] || []}
            selectedElementId={selectedElement?.id}
            onSelectElement={(id) => selectElement(currentTextureArea, id)}
            onUpdateElement={handleElementUpdate}
            onRemoveElement={handleElementRemove}
          />
        </aside>

        {/* Center - 3D View */}
        <main className="flex-1 flex flex-col bg-gray-100">
          <div className="flex-1 relative">
            <Scene3D
              product={product}
              design={currentDesign}
              currentTextureArea={currentTextureArea}
              onElementUpdate={handleElementUpdate}
            />
          </div>
          
          {/* View Controls */}
          <div className="bg-white border-t p-4">
            <ViewControls
              textureAreas={product.textureAreas}
              currentArea={currentTextureArea}
              onAreaChange={handleTextureAreaChange}
            />
          </div>
        </main>

        {/* Right Panel - Properties */}
        <aside className="w-80 bg-white border-l overflow-y-auto">
          <PropertyPanel
            selectedElement={selectedElement}
            onUpdate={(updates) => {
              if (selectedElement) {
                handleElementUpdate(selectedElement.id, updates);
              }
            }}
          />
        </aside>
      </div>
    </div>
  );
};

export default Atelier;
```

### 2. Scene 3D avec Babylon.js

```typescript
// components/atelier/Scene3D.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { Design, Product, TextureArea } from '../types';
import { BabylonDesignService } from '../services/babylon.service';

interface Scene3DProps {
  product: Product;
  design: Design | null;
  currentTextureArea: string;
  onElementUpdate: (id: string, updates: any) => void;
}

const Scene3D: React.FC<Scene3DProps> = ({
  product,
  design,
  currentTextureArea,
  onElementUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<BABYLON.Engine | null>(null);
  const [scene, setScene] = useState<BABYLON.Scene | null>(null);
  const [productMesh, setProductMesh] = useState<BABYLON.Mesh | null>(null);

  // Initialisation de la scène
  useEffect(() => {
    if (!canvasRef.current) return;

    const eng = new BABYLON.Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    const sc = new BABYLON.Scene(eng);
    sc.clearColor = new BABYLON.Color4(0.95, 0.95, 0.95, 1);

    // Optimisations
    sc.autoClear = false;
    sc.autoClearDepthAndStencil = false;

    // Caméra
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2.5,
      5,
      BABYLON.Vector3.Zero(),
      sc
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 10;
    camera.wheelPrecision = 50;
    camera.panningSensibility = 100;

    // Lumières
    const hemiLight = new BABYLON.HemisphericLight(
      'hemiLight',
      new BABYLON.Vector3(0, 1, 0),
      sc
    );
    hemiLight.intensity = 0.7;

    const dirLight = new BABYLON.DirectionalLight(
      'dirLight',
      new BABYLON.Vector3(-1, -2, -1),
      sc
    );
    dirLight.intensity = 0.5;
    dirLight.position = new BABYLON.Vector3(5, 10, 5);

    // Shadow generator pour réalisme
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;

    // Ground pour recevoir ombres
    const ground = BABYLON.MeshBuilder.CreateGround('ground', {
      width: 10,
      height: 10
    }, sc);
    ground.position.y = -1;
    ground.receiveShadows = true;
    const groundMat = new BABYLON.StandardMaterial('groundMat', sc);
    groundMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    groundMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = groundMat;

    // Charger le modèle 3D
    BABYLON.SceneLoader.ImportMesh(
      '',
      '/models/',
      product.modelPath,
      sc,
      (meshes) => {
        const rootMesh = meshes[0] as BABYLON.Mesh;
        
        // Centrer et ajuster taille
        const boundingBox = rootMesh.getHierarchyBoundingVectors();
        const size = boundingBox.max.subtract(boundingBox.min);
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDimension;
        rootMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
        
        const center = boundingBox.max.add(boundingBox.min).scale(0.5);
        rootMesh.position = center.negate().scale(scale);

        // Appliquer ombres
        meshes.forEach(mesh => {
          shadowGenerator.addShadowCaster(mesh);
        });

        // Créer matériau PBR
        const pbrMat = new BABYLON.PBRMaterial('productPBR', sc);
        pbrMat.albedoColor = new BABYLON.Color3(1, 1, 1);
        pbrMat.metallic = 0;
        pbrMat.roughness = 0.8;
        pbrMat.environmentIntensity = 0.5;

        meshes.forEach(mesh => {
          if (mesh !== rootMesh) {
            mesh.material = pbrMat;
          }
        });

        setProductMesh(rootMesh);
      }
    );

    // Render loop
    eng.runRenderLoop(() => {
      sc.render();
    });

    // Resize handler
    const handleResize = () => {
      eng.resize();
    };
    window.addEventListener('resize', handleResize);

    setEngine(eng);
    setScene(sc);

    return () => {
      window.removeEventListener('resize', handleResize);
      sc.dispose();
      eng.dispose();
    };
  }, [product]);

  // Appliquer le design sur la texture
  useEffect(() => {
    if (!scene || !productMesh || !design) return;

    const textureArea = product.textureAreas.find(
      area => area.id === currentTextureArea
    );

    if (!textureArea) return;

    const elements = design.elements[currentTextureArea] || [];

    // Créer ou mettre à jour la texture
    BabylonDesignService.applyDesignToProduct(
      productMesh,
      elements,
      textureArea,
      scene
    );

  }, [scene, productMesh, design, currentTextureArea, product]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
};

export default Scene3D;
```

### 3. Service Babylon.js - Application de Design

```typescript
// services/babylon.service.ts
import * as BABYLON from '@babylonjs/core';
import { DesignElement, ImageElement, TextElement, ShapeElement, TextureArea } from '../types';

export class BabylonDesignService {
  private static textureCache: Map<string, BABYLON.DynamicTexture> = new Map();

  static applyDesignToProduct(
    mesh: BABYLON.Mesh,
    elements: DesignElement[],
    textureArea: TextureArea,
    scene: BABYLON.Scene
  ): BABYLON.DynamicTexture {
    const cacheKey = `${mesh.id}_${textureArea.id}`;
    
    // Vérifier cache
    let dynamicTexture = this.textureCache.get(cacheKey);
    
    if (!dynamicTexture) {
      // Créer nouvelle texture dynamique
      dynamicTexture = new BABYLON.DynamicTexture(
        `texture_${textureArea.id}`,
        {
          width: textureArea.canvasSize.width,
          height: textureArea.canvasSize.height
        },
        scene,
        false,
        BABYLON.Texture.TRILINEAR_SAMPLINGMODE
      );
      
      this.textureCache.set(cacheKey, dynamicTexture);
    }

    // Dessiner sur la texture
    this.drawElementsOnTexture(dynamicTexture, elements, textureArea);

    // Appliquer au mesh
    const material = mesh.material as BABYLON.PBRMaterial;
    if (material) {
      material.albedoTexture = dynamicTexture;
    }

    return dynamicTexture;
  }

  private static drawElementsOnTexture(
    texture: BABYLON.DynamicTexture,
    elements: DesignElement[],
    textureArea: TextureArea
  ): void {
    const ctx = texture.getContext();
    const { width, height } = texture.getSize();

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Fond blanc
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Trier par zIndex
    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    // Dessiner chaque élément
    sortedElements.forEach(element => {
      if (!element.visible) return;

      ctx.save();
      ctx.globalAlpha = element.opacity;

      // Appliquer rotation
      if (element.rotation !== 0) {
        const centerX = element.position.x + (element.size?.width || 0) / 2;
        const centerY = element.position.y + (element.size?.height || 0) / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((element.rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
      }

      switch (element.type) {
        case 'image':
          this.drawImageElement(ctx, element as ImageElement);
          break;
        case 'text':
          this.drawTextElement(ctx, element as TextElement);
          break;
        case 'shape':
          this.drawShapeElement(ctx, element as ShapeElement);
          break;
      }

      ctx.restore();
    });

    // Mettre à jour la texture
    texture.update();
  }

  private static drawImageElement(
    ctx: CanvasRenderingContext2D,
    element: ImageElement
  ): void {
    const img = new Image();
    img.src = element.imageData;
    
    if (element.filters) {
      // Appliquer filtres CSS
      const filters: string[] = [];
      if (element.filters.brightness !== 100) {
        filters.push(`brightness(${element.filters.brightness}%)`);
      }
      if (element.filters.contrast !== 100) {
        filters.push(`contrast(${element.filters.contrast}%)`);
      }
      if (element.filters.saturation !== 100) {
        filters.push(`saturate(${element.filters.saturation}%)`);
      }
      if (element.filters.blur > 0) {
        filters.push(`blur(${element.filters.blur}px)`);
      }
      if (element.filters.grayscale) {
        filters.push('grayscale(100%)');
      }
      if (element.filters.sepia) {
        filters.push('sepia(100%)');
      }
      ctx.filter = filters.join(' ');
    }

    ctx.drawImage(
      img,
      element.position.x,
      element.position.y,
      element.size!.width,
      element.size!.height
    );

    ctx.filter = 'none';
  }

  private static drawTextElement(
    ctx: CanvasRenderingContext2D,
    element: TextElement
  ): void {
    ctx.font = `${element.fontStyle} ${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
    ctx.fillStyle = element.color;
    ctx.textAlign = element.textAlign;
    
    // Appliquer letter spacing
    if (element.letterSpacing !== 0) {
      const chars = element.text.split('');
      let currentX = element.position.x;
      
      chars.forEach(char => {
        ctx.fillText(char, currentX, element.position.y);
        const charWidth = ctx.measureText(char).width;
        currentX += charWidth + element.letterSpacing;
      });
    } else {
      // Multi-line support
      const lines = element.text.split('\n');
      lines.forEach((line, index) => {
        const y = element.position.y + (index * element.fontSize * element.lineHeight);
        ctx.fillText(line, element.position.x, y);
      });
    }
  }

  private static drawShapeElement(
    ctx: CanvasRenderingContext2D,
    element: ShapeElement
  ): void {
    ctx.fillStyle = element.fillColor;
    
    if (element.strokeColor && element.strokeWidth) {
      ctx.strokeStyle = element.strokeColor;
      ctx.lineWidth = element.strokeWidth;
    }

    const { x, y } = element.position;
    const { width, height } = element.size!;

    switch (element.shapeType) {
      case 'rectangle':
        ctx.fillRect(x, y, width, height);
        if (element.strokeWidth) {
          ctx.strokeRect(x, y, width, height);
        }
        break;

      case 'circle':
        const radius = Math.min(width, height) / 2;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
        ctx.fill();
        if (element.strokeWidth) {
          ctx.stroke();
        }
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width, y + height);