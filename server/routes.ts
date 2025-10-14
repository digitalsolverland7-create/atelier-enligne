// API Routes - reference: blueprint javascript_log_in_with_replit
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertDesignSchema,
  insertOrderSchema,
  insertShopItemSchema,
  insertCommentSchema,
  insertProductSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // ============================================================================
  // AUTH ROUTES
  // ============================================================================

  app.get('/api/auth/user', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============================================================================
  // PRODUCT ROUTES
  // ============================================================================

  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Admin route to create products (protected)
  app.post("/api/products", isAuthenticated, async (req: any, res: Response) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // ============================================================================
  // DESIGN ROUTES
  // ============================================================================

  app.get("/api/designs/my", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const designs = await storage.getUserDesigns(userId);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching user designs:", error);
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  app.get("/api/designs/public", async (req: Request, res: Response) => {
    try {
      const designs = await storage.getPublicDesigns();
      res.json(designs);
    } catch (error) {
      console.error("Error fetching public designs:", error);
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  app.get("/api/designs/:id", async (req: Request, res: Response) => {
    try {
      const design = await storage.getDesign(req.params.id);
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      res.json(design);
    } catch (error) {
      console.error("Error fetching design:", error);
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  app.post("/api/designs", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertDesignSchema.parse({
        ...req.body,
        userId,
      });
      const design = await storage.createDesign(validatedData);
      res.status(201).json(design);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid design data", errors: error.errors });
      }
      console.error("Error creating design:", error);
      res.status(500).json({ message: "Failed to create design" });
    }
  });

  app.put("/api/designs/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const design = await storage.getDesign(req.params.id);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      if (design.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedDesign = await storage.updateDesign(req.params.id, req.body);
      res.json(updatedDesign);
    } catch (error) {
      console.error("Error updating design:", error);
      res.status(500).json({ message: "Failed to update design" });
    }
  });

  app.delete("/api/designs/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const design = await storage.getDesign(req.params.id);
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      if (design.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteDesign(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting design:", error);
      res.status(500).json({ message: "Failed to delete design" });
    }
  });

  // ============================================================================
  // ORDER ROUTES
  // ============================================================================

  app.get("/api/orders/my", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId,
      });
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const updatedOrder = await storage.updateOrder(req.params.id, req.body);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // ============================================================================
  // SHOP ROUTES
  // ============================================================================

  app.get("/api/shop/my-items", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getUserShopItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching shop items:", error);
      res.status(500).json({ message: "Failed to fetch shop items" });
    }
  });

  app.post("/api/shop/items", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertShopItemSchema.parse({
        ...req.body,
        sellerId: userId,
      });
      const item = await storage.createShopItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid shop item data", errors: error.errors });
      }
      console.error("Error creating shop item:", error);
      res.status(500).json({ message: "Failed to create shop item" });
    }
  });

  app.put("/api/shop/items/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const item = await storage.updateShopItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Shop item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating shop item:", error);
      res.status(500).json({ message: "Failed to update shop item" });
    }
  });

  app.delete("/api/shop/items/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      await storage.deleteShopItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting shop item:", error);
      res.status(500).json({ message: "Failed to delete shop item" });
    }
  });

  app.put("/api/shop/settings", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { shopName, shopDescription } = req.body;
      const user = await storage.updateUserShop(userId, shopName, shopDescription);
      res.json(user);
    } catch (error) {
      console.error("Error updating shop settings:", error);
      res.status(500).json({ message: "Failed to update shop settings" });
    }
  });

  // ============================================================================
  // MARKETPLACE ROUTES
  // ============================================================================

  app.get("/api/marketplace", async (req: Request, res: Response) => {
    try {
      const items = await storage.getActiveShopItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
      res.status(500).json({ message: "Failed to fetch marketplace items" });
    }
  });

  // ============================================================================
  // SOCIAL ROUTES
  // ============================================================================

  app.post("/api/designs/:id/like", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      await storage.likeDesign(userId, req.params.id);
      res.status(200).json({ message: "Design liked" });
    } catch (error) {
      console.error("Error liking design:", error);
      res.status(500).json({ message: "Failed to like design" });
    }
  });

  app.delete("/api/designs/:id/like", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      await storage.unlikeDesign(userId, req.params.id);
      res.status(200).json({ message: "Design unliked" });
    } catch (error) {
      console.error("Error unliking design:", error);
      res.status(500).json({ message: "Failed to unlike design" });
    }
  });

  app.get("/api/designs/:id/comments", async (req: Request, res: Response) => {
    try {
      const comments = await storage.getDesignComments(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/designs/:id/comments", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCommentSchema.parse({
        ...req.body,
        userId,
        designId: req.params.id,
      });
      const comment = await storage.addComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
