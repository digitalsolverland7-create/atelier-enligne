import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// AUTH & USER TABLES (Replit Auth Integration)
// ============================================================================

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth + Extended for POD platform
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // POD Platform extensions
  shopName: varchar("shop_name"),
  shopDescription: text("shop_description"),
  shopLogoUrl: varchar("shop_logo_url"),
  isShopActive: boolean("is_shop_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// ============================================================================
// PRODUCT TABLES
// ============================================================================

export const productCategories = pgTable("product_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  categoryId: varchar("category_id").references(() => productCategories.id),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  modelPath: varchar("model_path").notNull(), // Path to 3D model file
  previewImageUrl: varchar("preview_image_url"),
  availableColors: jsonb("available_colors").$type<string[]>().default([]), // Array of color hex codes
  availableSizes: jsonb("available_sizes").$type<string[]>(), // Array of sizes (optional)
  textureAreas: jsonb("texture_areas").$type<TextureArea[]>().notNull(), // Customizable areas
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// TypeScript interfaces for JSONB fields
export interface TextureArea {
  id: string;
  name: string; // "Front", "Back", "Sleeves", etc.
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

// ============================================================================
// DESIGN TABLES
// ============================================================================

export const designs = pgTable("designs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  productColor: varchar("product_color", { length: 50 }).notNull(),
  productSize: varchar("product_size", { length: 20 }),
  textureAreaId: varchar("texture_area_id").notNull(), // Which area was customized
  elements: jsonb("elements").$type<DesignElement[]>().notNull().default([]),
  previewImageUrl: varchar("preview_image_url"), // Generated preview
  isPublic: boolean("is_public").default(false),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Design element types
export type DesignElementType = 'image' | 'text' | 'shape';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BaseDesignElement {
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

export interface ImageElement extends BaseDesignElement {
  type: 'image';
  imageData: string; // Base64 or URL
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    grayscale: boolean;
    sepia: boolean;
  };
}

export interface TextElement extends BaseDesignElement {
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

export interface ShapeElement extends BaseDesignElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'star';
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export type DesignElement = ImageElement | TextElement | ShapeElement;

// ============================================================================
// SHOP & MARKETPLACE TABLES
// ============================================================================

export const shopItems = pgTable("shop_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").references(() => users.id).notNull(),
  designId: varchar("design_id").references(() => designs.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  views: integer("views").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// ORDER TABLES
// ============================================================================

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  designId: varchar("design_id").references(() => designs.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default('pending'), // pending, confirmed, in_production, shipped, delivered, cancelled
  shippingAddress: jsonb("shipping_address").$type<ShippingAddress>(),
  trackingNumber: varchar("tracking_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

// ============================================================================
// SOCIAL FEATURES
// ============================================================================

export const designLikes = pgTable("design_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  designId: varchar("design_id").references(() => designs.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const designComments = pgTable("design_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  designId: varchar("design_id").references(() => designs.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  designs: many(designs),
  orders: many(orders),
  shopItems: many(shopItems),
  likes: many(designLikes),
  comments: many(designComments),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  designs: many(designs),
}));

export const designsRelations = relations(designs, ({ one, many }) => ({
  user: one(users, {
    fields: [designs.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [designs.productId],
    references: [products.id],
  }),
  orders: many(orders),
  shopItems: many(shopItems),
  likes: many(designLikes),
  comments: many(designComments),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  design: one(designs, {
    fields: [orders.designId],
    references: [designs.id],
  }),
}));

export const shopItemsRelations = relations(shopItems, ({ one }) => ({
  seller: one(users, {
    fields: [shopItems.sellerId],
    references: [users.id],
  }),
  design: one(designs, {
    fields: [shopItems.designId],
    references: [designs.id],
  }),
}));

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

// Product schemas
export const insertProductCategorySchema = createInsertSchema(productCategories).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Design schemas
export const insertDesignSchema = createInsertSchema(designs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
  likes: true,
});

// Order schemas
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Shop item schemas
export const insertShopItemSchema = createInsertSchema(shopItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

// Comment schema
export const insertCommentSchema = createInsertSchema(designComments).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type ProductCategory = typeof productCategories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertDesign = z.infer<typeof insertDesignSchema>;
export type Design = typeof designs.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertShopItem = z.infer<typeof insertShopItemSchema>;
export type ShopItem = typeof shopItems.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type DesignComment = typeof designComments.$inferSelect;
export type DesignLike = typeof designLikes.$inferSelect;
