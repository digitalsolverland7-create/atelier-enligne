// Database setup - reference: blueprint javascript_database
import dotenv from "dotenv";
dotenv.config();

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { products, productCategories } from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Seed product categories first
async function seedDatabase() {
  try {
    // Insert categories
    await db.insert(productCategories).values([
      {
        id: "category-vetements",
        name: "Vêtements",
        slug: "vetements",
        description: "Articles vestimentaires personnalisables"
      },
      {
        id: "category-maison",
        name: "Maison & Décoration",
        slug: "maison-decoration",
        description: "Articles pour la maison"
      }
    ]).onConflictDoNothing();

    // Insert products
    await db.insert(products).values([
    {
      id: "product-tshirt",
      name: "T-Shirt Personnalisé",
      description: "T-shirt de qualité supérieure 100% coton",
      categoryId: "category-vetements",
      basePrice: "25.00",
      modelPath: "/models/scene.gltf",
      previewImageUrl: "/images/products/tshirt-preview.jpg",
      availableColors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF"],
      availableSizes: ["S", "M", "L", "XL"],
      textureAreas: [
        {
          id: "front",
          name: "Face avant",
          uvMapping: { x: 0, y: 0, width: 512, height: 512 },
          maxDesignSize: { width: 300, height: 300 },
          canvasSize: { width: 1024, height: 1024 }
        },
        {
          id: "back",
          name: "Dos",
          uvMapping: { x: 512, y: 0, width: 512, height: 512 },
          maxDesignSize: { width: 300, height: 300 },
          canvasSize: { width: 1024, height: 1024 }
        }
      ],
      isActive: true,
      sortOrder: 1
    },
    {
      id: "product-mug",
      name: "Mug Personnalisé",
      description: "Mug céramique blanc, passage au lave-vaisselle",
      categoryId: "category-maison",
      basePrice: "15.00",
      modelPath: "/models/scene.gltf",
      previewImageUrl: "/images/products/mug-preview.jpg",
      availableColors: ["#FFFFFF"],
      textureAreas: [
        {
          id: "front",
          name: "Face avant",
          uvMapping: { x: 0, y: 0, width: 1024, height: 512 },
          maxDesignSize: { width: 400, height: 200 },
          canvasSize: { width: 1024, height: 1024 }
        }
      ],
      isActive: true,
      sortOrder: 2
    },
    {
      id: "product-cap",
      name: "Casquette Baseball",
      description: "Casquette baseball ajustable",
      categoryId: "category-vetements",
      basePrice: "20.00",
      modelPath: "/models/scene.gltf",
      previewImageUrl: "/images/products/cap-preview.jpg",
      availableColors: ["#000000", "#0000FF", "#FF0000", "#FFFFFF"],
      textureAreas: [
        {
          id: "front",
          name: "Devant",
          uvMapping: { x: 0, y: 0, width: 512, height: 512 },
          maxDesignSize: { width: 200, height: 200 },
          canvasSize: { width: 1024, height: 1024 }
        }
      ],
      isActive: true,
      sortOrder: 3
    },
    {
      id: "product-cushion",
      name: "Coussin Personnalisé",
      description: "Coussin 45x45cm avec housse lavable",
      categoryId: "category-maison",
      basePrice: "30.00",
      modelPath: "/models/scene.gltf",
      previewImageUrl: "/images/products/cushion-preview.jpg",
      availableColors: ["#FFFFFF", "#000000", "#0000FF", "#FF0000"],
      availableSizes: ["45x45cm"],
      textureAreas: [
        {
          id: "front",
          name: "Face avant",
          uvMapping: { x: 0, y: 0, width: 512, height: 512 },
          maxDesignSize: { width: 400, height: 400 },
          canvasSize: { width: 1024, height: 1024 }
        },
        {
          id: "back",
          name: "Dos",
          uvMapping: { x: 512, y: 0, width: 512, height: 512 },
          maxDesignSize: { width: 400, height: 400 },
          canvasSize: { width: 1024, height: 1024 }
        }
      ],
      isActive: true,
      sortOrder: 4
    }
    ]).onConflictDoNothing();

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Run seed on startup
seedDatabase();