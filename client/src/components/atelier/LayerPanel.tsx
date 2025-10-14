import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Unlock, Trash2, Type, Image as ImageIcon, Shapes } from "lucide-react";
import type { DesignElement } from "@shared/schema";

interface LayerPanelProps {
  elements: DesignElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
}

export function LayerPanel({ 
  elements, 
  selectedElementId, 
  onSelectElement, 
  onDeleteElement,
  onUpdateElement 
}: LayerPanelProps) {
  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'shape': return <Shapes className="w-4 h-4" />;
      default: return null;
    }
  };

  const getElementLabel = (element: DesignElement) => {
    if (element.type === 'text') {
      return (element as any).text.substring(0, 20);
    }
    if (element.type === 'shape') {
      return (element as any).shapeType;
    }
    return element.type;
  };

  if (elements.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Shapes className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun élément</p>
          <p className="text-xs mt-1">Ajoutez du texte, des images ou des formes</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {[...elements].reverse().map((element) => (
        <Card
          key={element.id}
          className={`p-3 cursor-pointer hover-elevate ${
            selectedElementId === element.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelectElement(element.id)}
          data-testid={`layer-${element.id}`}
        >
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground">
              {getElementIcon(element.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {getElementLabel(element)}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {element.type}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateElement(element.id, { visible: !element.visible });
                }}
                data-testid={`button-toggle-visibility-${element.id}`}
              >
                {element.visible ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateElement(element.id, { locked: !element.locked });
                }}
                data-testid={`button-toggle-lock-${element.id}`}
              >
                {element.locked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteElement(element.id);
                }}
                data-testid={`button-delete-${element.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
