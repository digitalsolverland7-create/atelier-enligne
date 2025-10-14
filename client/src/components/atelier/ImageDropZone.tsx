import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon } from "lucide-react";
import { nanoid } from "nanoid";
import type { ImageElement } from "@shared/schema";

interface ImageDropZoneProps {
  onAddElement: (element: ImageElement) => void;
  className?: string;
}

export function ImageDropZone({ onAddElement, className = "" }: ImageDropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop grande. Taille maximale: 5MB');
        return;
      }

      console.log('📁 Fichier droppé:', file.name, 'Type:', file.type, 'Taille:', file.size);

      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('📖 Fichier lu avec succès via drag & drop');
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
        console.log('🎨 Élément image créé via drag & drop:', imageElement);
        onAddElement(imageElement);
        console.log('✅ Élément ajouté via drag & drop');
      };
      reader.onerror = (error) => {
        console.error('❌ Erreur lors de la lecture du fichier via drag & drop:', error);
      };
      reader.readAsDataURL(file);
    });
  }, [onAddElement]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'
      } ${className}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        {isDragActive ? (
          <>
            <Upload className="w-8 h-8 text-primary" />
            <p className="text-sm text-primary font-medium">
              Déposez votre image ici...
            </p>
          </>
        ) : (
          <>
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Glissez-déposez une image ici
            </p>
            <p className="text-xs text-muted-foreground">
              ou cliquez pour sélectionner
            </p>
          </>
        )}
      </div>
    </div>
  );
}
