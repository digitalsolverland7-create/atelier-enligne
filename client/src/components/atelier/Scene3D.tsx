import { useEffect, useRef, useState } from "react";
import type { Product, DesignElement } from "@shared/schema";
import { Box, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";

interface Scene3DProps {
  product: Product;
  elements: DesignElement[];
  productColor: string;
  currentTextureArea: string;
}

export function Scene3D({ product, elements, productColor, currentTextureArea }: Scene3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const cameraRef = useRef<BABYLON.ArcRotateCamera | null>(null);
  const productMeshRef = useRef<BABYLON.Mesh | null>(null);
  const dynamicTextureRef = useRef<BABYLON.DynamicTexture | null>(null);

  // Initialize Babylon.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Create engine
    const engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      antialias: true,
    });
    engineRef.current = engine;

    // Create scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.18, 1);
    sceneRef.current = scene;

    // Create camera
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      4,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 10;
    camera.wheelPrecision = 50;
    camera.panningSensibility = 100;
    cameraRef.current = camera;

    // Create lighting
    const hemiLight = new BABYLON.HemisphericLight(
      "hemiLight",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    hemiLight.intensity = 0.6;

    const dirLight = new BABYLON.DirectionalLight(
      "dirLight",
      new BABYLON.Vector3(-1, -2, -1),
      scene
    );
    dirLight.intensity = 0.5;
    dirLight.position = new BABYLON.Vector3(5, 10, 5);

    // Create shadow generator
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, dirLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;

    // Create ground
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      scene
    );
    ground.position.y = -1;
    ground.receiveShadows = true;

    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.25);
    groundMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = groundMat;

    // Load 3D model
    const modelFilePath = '/models/scene.gltf'; 

    BABYLON.SceneLoader.ImportMesh(
      "",
      "", 
      modelFilePath,
      scene,
      (meshes) => {
        if (meshes.length === 0) return;

        console.log('🎯 ANALYSE DU MODÈLE 3D:');
        console.log('📊 Nombre de meshes:', meshes.length);
        
        meshes.forEach((mesh, index) => {
          console.log(`🔍 Mesh ${index}:`, {
            name: mesh.name,
            id: mesh.id,
            material: mesh.material?.name || 'Aucun matériau',
            hasUV: mesh instanceof BABYLON.Mesh ? !!mesh.getVerticesData(BABYLON.VertexBuffer.UVKind) : false,
            vertices: mesh instanceof BABYLON.Mesh ? mesh.getTotalVertices() : 0
          });
        });

        const rootMesh = meshes[0] as BABYLON.Mesh;
        productMeshRef.current = rootMesh;

        // Center and scale model
        const boundingBox = rootMesh.getHierarchyBoundingVectors();
        const size = boundingBox.max.subtract(boundingBox.min);
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDimension;
        rootMesh.scaling = new BABYLON.Vector3(scale, scale, scale);

        const center = boundingBox.max.add(boundingBox.min).scale(0.5);
        rootMesh.position = center.negate().scale(scale);

        // Add shadows to all meshes
        meshes.forEach((mesh) => {
          shadowGenerator.addShadowCaster(mesh);

          // NE PAS modifier les matériaux ici - garder les originaux
          console.log('🎨 Matériau original préservé pour:', mesh.name);
        });
      },
      undefined,
      (scene, message, exception) => {
        console.error("Error loading 3D model:", message, exception);

        // Fallback to basic shape if model fails to load
        const fallbackMesh = BABYLON.MeshBuilder.CreateBox("product", { 
          width: 1.5, 
          height: 1.5, 
          depth: 0.3 
        }, scene);
        productMeshRef.current = fallbackMesh;
        shadowGenerator.addShadowCaster(fallbackMesh);

        const pbrMat = new BABYLON.PBRMaterial("productPBR", scene);
        pbrMat.metallic = 0;
        pbrMat.roughness = 0.8;
        pbrMat.environmentIntensity = 0.5;
        fallbackMesh.material = pbrMat;
      }
    );

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Handle resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, [product.id]);

  // Update product color - appliqué à tous les meshes
  useEffect(() => {
    if (!productMeshRef.current || !sceneRef.current) return;

    const applyColorToMeshes = (mesh: BABYLON.AbstractMesh) => {
      if (mesh instanceof BABYLON.Mesh && mesh.material) {
        const material = mesh.material as BABYLON.PBRMaterial;
        if (material) {
          const color = BABYLON.Color3.FromHexString(productColor);
          material.albedoColor = color;
        }
      }
      
      // Appliquer aux enfants récursivement
      mesh.getChildMeshes().forEach(applyColorToMeshes);
    };

    applyColorToMeshes(productMeshRef.current);
  }, [productColor]);

  // Update design elements on texture
  useEffect(() => {
    console.log('🎨 Scene3D: Mise à jour des éléments de design:', elements.length, 'éléments');
    console.log('📋 Éléments reçus:', elements);
    
    if (!sceneRef.current || !productMeshRef.current || elements.length === 0) {
      console.log('⚠️ Conditions non remplies:', {
        scene: !!sceneRef.current,
        productMesh: !!productMeshRef.current,
        elementsCount: elements.length
      });
      
      // Si pas d'éléments, ne pas créer de texture
      if (dynamicTextureRef.current && productMeshRef.current) {
        console.log('🧹 Suppression de la texture existante');
        // Retirer la texture si elle existe
        const removeTextureFromMeshes = (mesh: BABYLON.AbstractMesh) => {
          if (mesh instanceof BABYLON.Mesh && mesh.material) {
            const material = mesh.material as BABYLON.PBRMaterial;
            if (material) {
              material.emissiveTexture = null;
              material.emissiveIntensity = 0;
            }
          }
          mesh.getChildMeshes().forEach(removeTextureFromMeshes);
        };
        removeTextureFromMeshes(productMeshRef.current);
      }
      return;
    }

    // Create or update dynamic texture
    if (!dynamicTextureRef.current) {
      console.log('🎨 Création de la texture dynamique');
      dynamicTextureRef.current = new BABYLON.DynamicTexture(
        "designTexture",
        { width: 2048, height: 2048 },
        sceneRef.current,
        false,
        BABYLON.Texture.TRILINEAR_SAMPLINGMODE
      );

      // Forcer la transparence sur la texture
      dynamicTextureRef.current.hasAlpha = true;
      
      console.log('🎯 Création d\'un plan de texture superposé à la casquette');
      // Créer un plan transparent qui se superpose à la casquette
      const createTextureOverlay = () => {
        if (!sceneRef.current || !productMeshRef.current) return;
        
        console.log('🔧 Création du plan de texture overlay');
        
        // Créer un plan qui se positionne devant la casquette
        const overlayPlane = BABYLON.MeshBuilder.CreatePlane("textureOverlay", {
          width: 0.6,  // Plus petit pour mieux s'adapter à la casquette
          height: 0.4  // Plus petit et proportionnel
        }, sceneRef.current);
        
        // Positionner le plan collé sur la casquette (côté face)
        overlayPlane.position = new BABYLON.Vector3(0, 0.1, -0.15); // Beaucoup plus proche de la casquette
        overlayPlane.rotation.y = Math.PI; // Rotation de 180° pour faire face à la caméra
        overlayPlane.rotation.x = -0.1; // Légère inclinaison pour suivre la courbure de la casquette
        
        // Créer un matériau transparent pour le plan
        const overlayMaterial = new BABYLON.StandardMaterial("overlayMaterial", sceneRef.current);
        overlayMaterial.diffuseTexture = dynamicTextureRef.current;
        if (overlayMaterial.diffuseTexture) {
          overlayMaterial.diffuseTexture.hasAlpha = true;
        }
        overlayMaterial.useAlphaFromDiffuseTexture = true;
        overlayMaterial.backFaceCulling = false; // Visible des deux côtés
        
        overlayPlane.material = overlayMaterial;
        
        // Stocker la référence pour pouvoir la mettre à jour
        (overlayPlane as any).isTextureOverlay = true;
        
        console.log('✅ Plan de texture overlay créé et positionné');
        
        return overlayPlane;
      };

      // Nettoyer les anciens plans overlay
      if (sceneRef.current) {
        const oldOverlays = sceneRef.current.meshes.filter(mesh => (mesh as any).isTextureOverlay);
        oldOverlays.forEach(overlay => overlay.dispose());
        console.log('🧹 Anciens overlays supprimés:', oldOverlays.length);
      }
      
      // Créer le plan overlay immédiatement et avec un délai pour s'assurer que le modèle est chargé
      createTextureOverlay();
      setTimeout(createTextureOverlay, 1000);
    }

    const texture = dynamicTextureRef.current;
    const ctx = texture.getContext() as CanvasRenderingContext2D;
    const width = 2048;
    const height = 2048;

    // Clear texture with fully transparent background
    ctx.clearRect(0, 0, width, height);
    
    // Fond transparent pour la texture
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
    
    // S'assurer que le canvas est transparent
    ctx.globalCompositeOperation = 'source-over';

    // Draw elements
    const drawElements = () => {
      let pendingImages = 0;

      elements.forEach((element) => {
        // Apply opacity and rotation
        ctx.save();
        ctx.globalAlpha = element.opacity;

        if (element.type === "text") {
          console.log('✏️ Rendu du texte:', element.text, 'à la position:', element.position);
          const fontSize = element.fontSize || 64; // Plus gros par défaut
          ctx.font = `bold ${fontSize}px ${element.fontFamily || "Inter"}`;
          ctx.fillStyle = element.color || "#FFFFFF"; // Blanc par défaut pour contraste
          ctx.strokeStyle = "#000000"; // Contour noir
          ctx.lineWidth = 3;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          const x = element.position?.x || width / 2;
          const y = element.position?.y || height / 2;
          
          if (element.rotation) {
            ctx.translate(x, y);
            ctx.rotate((element.rotation * Math.PI) / 180);
            ctx.strokeText(element.text || "", 0, 0); // Contour
            ctx.fillText(element.text || "", 0, 0); // Remplissage
            ctx.setTransform(1, 0, 0, 1, 0, 0);
          } else {
            ctx.strokeText(element.text || "", x, y); // Contour
            ctx.fillText(element.text || "", x, y); // Remplissage
          }
        } else if (element.type === "image" && element.imageData) {
          console.log('🖼️ Traitement de l\'image:', element.id, 'Position:', element.position, 'Taille:', element.size);
          pendingImages++;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            console.log('✅ Image chargée avec succès:', element.id);
            const x = element.position?.x || width / 2;
            const y = element.position?.y || height / 2;
            const w = element.size?.width || 300;
            const h = element.size?.height || 300;
            
            console.log('🎯 Dessin de l\'image à:', { x, y, w, h });
            
            ctx.save();
            ctx.globalAlpha = element.opacity;
            
            if (element.rotation) {
              ctx.translate(x + w / 2, y + h / 2);
              ctx.rotate((element.rotation * Math.PI) / 180);
              ctx.drawImage(img, -w / 2, -h / 2, w, h);
            } else {
              // Centrer l'image sur la position donnée
              ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
            }
            
            ctx.restore();
            
            pendingImages--;
            if (pendingImages === 0) {
              console.log('🔄 Mise à jour de la texture');
              texture.update();
            }
          };
          img.onerror = (error) => {
            pendingImages--;
            console.error("❌ Erreur lors du chargement de l'image:", element.imageData?.substring(0, 50) + '...', error);
          };
          img.src = element.imageData;
        } else if (element.type === "shape") {
          ctx.fillStyle = element.fillColor || "#000000";
          const x = element.position?.x || width / 2;
          const y = element.position?.y || height / 2;
          
          if (element.shapeType === "rectangle") {
            const w = element.size?.width || 100;
            const h = element.size?.height || 100;
            ctx.fillRect(x, y, w, h);
          } else if (element.shapeType === "circle") {
            ctx.beginPath();
            const radius = Math.min(element.size?.width || 100, element.size?.height || 100) / 2;
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
          }
        }

        ctx.restore();
      });

      // If no pending images, update immediately
      if (pendingImages === 0) {
        console.log('🔄 Mise à jour immédiate de la texture');
        texture.update();
        // Forcer un nouveau rendu de la scène
        if (sceneRef.current) {
          sceneRef.current.render();
        }
      }
    };

    drawElements();
  }, [elements, currentTextureArea]);

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.alpha = -Math.PI / 2;
      cameraRef.current.beta = Math.PI / 2.5;
      cameraRef.current.radius = 4;
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.radius = Math.max(
        cameraRef.current.radius - 0.5,
        cameraRef.current.lowerRadiusLimit || 2
      );
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.radius = Math.min(
        cameraRef.current.radius + 0.5,
        cameraRef.current.upperRadiusLimit || 10
      );
    }
  };

  return (
    <div className="flex-1 relative bg-[#1a1a2e]" data-testid="scene-3d-container">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        data-testid="canvas-3d"
        style={{ touchAction: "none" }}
      />

      {/* 3D Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleReset}
          title="Réinitialiser la vue"
          data-testid="button-reset-view"
        >
          <RotateCw className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          title="Zoom avant"
          data-testid="button-zoom-in"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          title="Zoom arrière"
          data-testid="button-zoom-out"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Info Overlay */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Box className="w-4 h-4" />
          <span>Vue 3D - {product.name}</span>
        </div>
      </div>
    </div>
  );
}