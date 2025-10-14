import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Type, Image as ImageIcon, Shapes, Palette } from "lucide-react";
import { nanoid } from "nanoid";
import type { DesignElement, TextElement, ImageElement, ShapeElement } from "@shared/schema";
import { ImageDropZone } from "./ImageDropZone";

interface ToolPanelProps {
  onAddElement: (element: DesignElement) => void;
  productColor: string;
  onColorChange: (color: string) => void;
  availableColors: string[];
}

export function ToolPanel({ onAddElement, productColor, onColorChange, availableColors }: ToolPanelProps) {
  const [selectedTool, setSelectedTool] = useState<'text' | 'image' | 'shape' | null>(null);

  const handleAddText = () => {
    const textElement: TextElement = {
      id: nanoid(),
      type: 'text',
      text: 'Nouveau texte',
      position: { x: 100, y: 100 },
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      visible: true,
      fontFamily: 'Inter',
      fontSize: 32,
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.2,
    };
    onAddElement(textElement);
    setSelectedTool(null);
  };

  const handleAddShape = (shapeType: 'rectangle' | 'circle') => {
    const shapeElement: ShapeElement = {
      id: nanoid(),
      type: 'shape',
      shapeType,
      position: { x: 150, y: 150 },
      size: { width: 100, height: 100 },
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      visible: true,
      fillColor: '#3b82f6',
      strokeColor: '#1e40af',
      strokeWidth: 2,
    };
    onAddElement(shapeElement);
    setSelectedTool(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('❌ Aucun fichier sélectionné');
      return;
    }

    console.log('📁 Fichier sélectionné:', file.name, 'Type:', file.type, 'Taille:', file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide');
      console.log('❌ Type de fichier invalide:', file.type);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image est trop grande. Taille maximale: 5MB');
      console.log('❌ Fichier trop grand:', file.size);
      return;
    }

    console.log('✅ Validation réussie, lecture du fichier...');
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log('📖 Fichier lu avec succès');
      const imageElement: ImageElement = {
        id: nanoid(),
        type: 'image',
        imageData: event.target?.result as string,
        position: { x: 1024, y: 800 }, // Position optimisée pour le devant de la casquette
        size: { width: 250, height: 250 }, // Taille adaptée pour un logo
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        locked: false,
        visible: true,
      };
      console.log('🎨 Élément image créé:', imageElement);
      onAddElement(imageElement);
      console.log('✅ Élément ajouté via onAddElement');
    };
    reader.onerror = (error) => {
      console.error('❌ Erreur lors de la lecture du fichier:', error);
    };
    reader.readAsDataURL(file);
    setSelectedTool(null);
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="p-4 space-y-6">
      {/* Product Color */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Couleur du produit</Label>
        <div className="grid grid-cols-5 gap-2">
          {availableColors.length > 0 ? (
            availableColors.map((color, index) => (
              <button
                key={index}
                onClick={() => onColorChange(color)}
                className={`w-10 h-10 rounded-md border-2 transition-all hover-elevate ${
                  productColor === color ? 'border-primary scale-110' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                title={color}
                data-testid={`button-color-${index}`}
              />
            ))
          ) : (
            <>
              <button
                onClick={() => onColorChange('#ffffff')}
                className={`w-10 h-10 rounded-md border-2 ${productColor === '#ffffff' ? 'border-primary' : 'border-border'}`}
                style={{ backgroundColor: '#ffffff' }}
              />
              <button
                onClick={() => onColorChange('#000000')}
                className={`w-10 h-10 rounded-md border-2 ${productColor === '#000000' ? 'border-primary' : 'border-border'}`}
                style={{ backgroundColor: '#000000' }}
              />
              <button
                onClick={() => onColorChange('#ef4444')}
                className={`w-10 h-10 rounded-md border-2 ${productColor === '#ef4444' ? 'border-primary' : 'border-border'}`}
                style={{ backgroundColor: '#ef4444' }}
              />
              <button
                onClick={() => onColorChange('#3b82f6')}
                className={`w-10 h-10 rounded-md border-2 ${productColor === '#3b82f6' ? 'border-primary' : 'border-border'}`}
                style={{ backgroundColor: '#3b82f6' }}
              />
              <button
                onClick={() => onColorChange('#10b981')}
                className={`w-10 h-10 rounded-md border-2 ${productColor === '#10b981' ? 'border-primary' : 'border-border'}`}
                style={{ backgroundColor: '#10b981' }}
              />
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Tools */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Outils</Label>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleAddText}
            data-testid="button-add-text"
          >
            <Type className="w-4 h-4 mr-2" />
            Ajouter du texte
          </Button>

          <div className="space-y-3">
            <ImageDropZone onAddElement={onAddElement} />
            
            <div className="text-center text-xs text-muted-foreground">
              ou
            </div>
            
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                data-testid="input-image-upload"
              />
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => document.getElementById('image-upload')?.click()}
                data-testid="button-add-image"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Parcourir les fichiers
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAddShape('rectangle')}
            data-testid="button-add-rectangle"
          >
            <Shapes className="w-4 h-4 mr-2" />
            Ajouter un rectangle
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleAddShape('circle')}
            data-testid="button-add-circle"
          >
            <Shapes className="w-4 h-4 mr-2" />
            Ajouter un cercle
          </Button>
        </div>
      </div>
    </div>
  );
}
