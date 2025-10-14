// Storage implementation - reference: blueprints javascript_log_in_with_replit & javascript_database
import {
  users,
  products,
  designs,
  orders,
  shopItems,
  designComments,
  designLikes,
  productCategories,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Design,
  type InsertDesign,
  type Order,
  type InsertOrder,
  type ShopItem,
  type InsertShopItem,
  type DesignComment,
  type InsertComment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserShop(userId: string, shopName: string, shopDescription: string): Promise<User | undefined>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Design operations
  getUserDesigns(userId: string): Promise<Design[]>;
  getPublicDesigns(): Promise<Design[]>;
  getDesign(id: string): Promise<Design | undefined>;
  createDesign(design: InsertDesign): Promise<Design>;
  updateDesign(id: string, updates: Partial<Design>): Promise<Design | undefined>;
  deleteDesign(id: string): Promise<void>;
  
  // Order operations
  getUserOrders(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  
  // Shop operations
  getUserShopItems(userId: string): Promise<(ShopItem & { design: Design })[]>;
  getActiveShopItems(): Promise<(ShopItem & { design: Design })[]>;
  createShopItem(item: InsertShopItem): Promise<ShopItem>;
  updateShopItem(id: string, updates: Partial<ShopItem>): Promise<ShopItem | undefined>;
  deleteShopItem(id: string): Promise<void>;
  
  // Social operations
  likeDesign(userId: string, designId: string): Promise<void>;
  unlikeDesign(userId: string, designId: string): Promise<void>;
  addComment(comment: InsertComment): Promise<DesignComment>;
  getDesignComments(designId: string): Promise<DesignComment[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserShop(userId: string, shopName: string, shopDescription: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        shopName,
        shopDescription,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(products.sortOrder);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  // Design operations
  async getUserDesigns(userId: string): Promise<Design[]> {
    return await db.select().from(designs).where(eq(designs.userId, userId)).orderBy(desc(designs.createdAt));
  }

  async getPublicDesigns(): Promise<Design[]> {
    return await db.select().from(designs).where(eq(designs.isPublic, true)).orderBy(desc(designs.createdAt));
  }

  async getDesign(id: string): Promise<Design | undefined> {
    const [design] = await db.select().from(designs).where(eq(designs.id, id));
    return design;
  }

  async createDesign(designData: InsertDesign): Promise<Design> {
    const [design] = await db.insert(designs).values(designData).returning();
    return design;
  }

  async updateDesign(id: string, updates: Partial<Design>): Promise<Design | undefined> {
    const [design] = await db
      .update(designs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(designs.id, id))
      .returning();
    return design;
  }

  async deleteDesign(id: string): Promise<void> {
    await db.delete(designs).where(eq(designs.id, id));
  }

  // Order operations
  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Shop operations
  async getUserShopItems(userId: string): Promise<(ShopItem & { design: Design })[]> {
    const items = await db
      .select()
      .from(shopItems)
      .leftJoin(designs, eq(shopItems.designId, designs.id))
      .where(eq(shopItems.sellerId, userId))
      .orderBy(desc(shopItems.createdAt));

    return items.map(item => ({
      ...item.shop_items,
      design: item.designs!,
    })) as (ShopItem & { design: Design })[];
  }

  async getActiveShopItems(): Promise<(ShopItem & { design: Design })[]> {
    const items = await db
      .select()
      .from(shopItems)
      .leftJoin(designs, eq(shopItems.designId, designs.id))
      .where(and(eq(shopItems.isActive, true), eq(designs.isPublic, true)))
      .orderBy(desc(shopItems.createdAt));

    return items.map(item => ({
      ...item.shop_items,
      design: item.designs!,
    })) as (ShopItem & { design: Design })[];
  }

  async createShopItem(itemData: InsertShopItem): Promise<ShopItem> {
    const [item] = await db.insert(shopItems).values(itemData).returning();
    return item;
  }

  async updateShopItem(id: string, updates: Partial<ShopItem>): Promise<ShopItem | undefined> {
    const [item] = await db
      .update(shopItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(shopItems.id, id))
      .returning();
    return item;
  }

  async deleteShopItem(id: string): Promise<void> {
    await db.delete(shopItems).where(eq(shopItems.id, id));
  }

  // Social operations
  async likeDesign(userId: string, designId: string): Promise<void> {
    await db.insert(designLikes).values({ userId, designId });
    await db
      .update(designs)
      .set({ likes: db.$count(designLikes, eq(designLikes.designId, designId)) } as any)
      .where(eq(designs.id, designId));
  }

  async unlikeDesign(userId: string, designId: string): Promise<void> {
    await db.delete(designLikes).where(and(eq(designLikes.userId, userId), eq(designLikes.designId, designId)));
  }

  async addComment(commentData: InsertComment): Promise<DesignComment> {
    const [comment] = await db.insert(designComments).values(commentData).returning();
    return comment;
  }

  async getDesignComments(designId: string): Promise<DesignComment[]> {
    return await db.select().from(designComments).where(eq(designComments.designId, designId)).orderBy(desc(designComments.createdAt));
  }
}

export const storage = new DatabaseStorage();
