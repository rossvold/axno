import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { product } from "./product";

export const product_stock = sqliteTable("product_stock", {
	// Primary identifiers
  id: text("id").primaryKey(), // UUID for unique identification
  product_number: integer("product_number").notNull().references(() => product.product_number), // Foreign key to product
  amount: real("amount"), // What the unit is is set in product.unit
	// Stock management
  stock_real: integer("stock_real").notNull().default(0), // REAL STOCK
  stock_order: integer("stock_order").notNull().default(0), // Ordered amount
  stock_processing: integer("stock_processing").default(0), // Stock in plukkliste. Do not allow stock_processing be larger than stock_real
  stock_minimum: integer("stock_minimum").default(0),
  active: integer("active", { mode: 'boolean' }).notNull().default(true), // Whether this stock entry is active and should appear in dropdowns
	// Timestamps
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type ProductStock = typeof product_stock.$inferSelect;
