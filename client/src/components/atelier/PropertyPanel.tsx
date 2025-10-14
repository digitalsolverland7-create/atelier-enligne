import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DesignElement, TextElement, ShapeElement } from "@shared/schema";

interface PropertyPanelProps {
  element: DesignElement;
  onUpdate: (updates: Partial<DesignElement>) => void;
}

export function PropertyPanel({ element, onUpdate }: PropertyPanelProps) {
  return (
    <div className="space-y-4">
      {/* Position */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Position</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="pos-x" className="text-xs">X</Label>
            <Input
              id="pos-x"
              type="number"
              value={element.position.x}
              onChange={(e) => onUpdate({ position: { ...element.position, x: parseInt(e.target.value) || 0 } })}
              data-testid="input-position-x"
            />
          </div>
          <div>
            <Label htmlFor="pos-y" className="text-xs">Y</Label>
            <Input
              id="pos-y"
              type="number"
              value={element.position.y}
              onChange={(e) => onUpdate({ position: { ...element.position, y: parseInt(e.target.value) || 0 } })}
              data-testid="input-position-y"
            />
          </div>
        </div>
      </Card>

      {/* Size (for images and shapes) */}
      {element.size && (
        <Card className="p-4">
          <Label className="text-sm font-medium mb-3 block">Taille</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="size-w" className="text-xs">Largeur</Label>
              <Input
                id="size-w"
                type="number"
                value={element.size.width}
                onChange={(e) => onUpdate({ size: { ...element.size!, width: parseInt(e.target.value) || 0 } })}
                data-testid="input-size-width"
              />
            </div>
            <div>
              <Label htmlFor="size-h" className="text-xs">Hauteur</Label>
              <Input
                id="size-h"
                type="number"
                value={element.size.height}
                onChange={(e) => onUpdate({ size: { ...element.size!, height: parseInt(e.target.value) || 0 } })}
                data-testid="input-size-height"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Text Properties */}
      {element.type === 'text' && (
        <>
          <Card className="p-4">
            <Label className="text-sm font-medium mb-3 block">Texte</Label>
            <Input
              value={(element as TextElement).text}
              onChange={(e) => onUpdate({ text: e.target.value } as any)}
              data-testid="input-text-content"
            />
          </Card>

          <Card className="p-4">
            <Label className="text-sm font-medium mb-3 block">Police</Label>
            <Select 
              value={(element as TextElement).fontFamily}
              onValueChange={(value) => onUpdate({ fontFamily: value } as any)}
            >
              <SelectTrigger data-testid="select-font-family">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
                <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-4">
            <Label className="text-sm font-medium mb-3 block">Taille de police</Label>
            <Input
              type="number"
              value={(element as TextElement).fontSize}
              onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) || 12 } as any)}
              data-testid="input-font-size"
            />
          </Card>

          <Card className="p-4">
            <Label className="text-sm font-medium mb-3 block">Couleur</Label>
            <Input
              type="color"
              value={(element as TextElement).color}
              onChange={(e) => onUpdate({ color: e.target.value } as any)}
              data-testid="input-text-color"
            />
          </Card>
        </>
      )}

      {/* Shape Properties */}
      {element.type === 'shape' && (
        <>
          <Card className="p-4">
            <Label className="text-sm font-medium mb-3 block">Couleur de remplissage</Label>
            <Input
              type="color"
              value={(element as ShapeElement).fillColor}
              onChange={(e) => onUpdate({ fillColor: e.target.value } as any)}
              data-testid="input-fill-color"
            />
          </Card>

          <Card className="p-4">
            <Label className="text-sm font-medium mb-3 block">Couleur de bordure</Label>
            <Input
              type="color"
              value={(element as ShapeElement).strokeColor || '#000000'}
              onChange={(e) => onUpdate({ strokeColor: e.target.value } as any)}
              data-testid="input-stroke-color"
            />
          </Card>
        </>
      )}

      {/* Common Properties */}
      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Rotation: {element.rotation}°</Label>
        <Slider
          value={[element.rotation]}
          onValueChange={([value]) => onUpdate({ rotation: value })}
          min={0}
          max={360}
          step={1}
          data-testid="slider-rotation"
        />
      </Card>

      <Card className="p-4">
        <Label className="text-sm font-medium mb-3 block">Opacité: {Math.round(element.opacity * 100)}%</Label>
        <Slider
          value={[element.opacity * 100]}
          onValueChange={([value]) => onUpdate({ opacity: value / 100 })}
          min={0}
          max={100}
          step={1}
          data-testid="slider-opacity"
        />
      </Card>
    </div>
  );
}
