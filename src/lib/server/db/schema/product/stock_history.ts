import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { product_stock } from "./product_stock";

export const product_stock_history = sqliteTable("product_stock_history", {
  id: text("id").primaryKey(), // UUID for unique identification
  product_stock_id: text("product_stock_id").notNull().references(() => product_stock.id), // Foreign key to product_stock
  field_changed: text("field_changed").notNull(), // 'stock_real' or 'stock_order'
  amount_changed: integer("amount_changed").notNull(), // Positive or negative value
  value_before: integer("value_before").notNull(), // Stock value before change
  value_after: integer("value_after").notNull(), // Stock value after change
  user_id: text("user_id").notNull(), // Who made the change (references S001)
  message: text("message").notNull(), // Description of why change was made
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

export type ProductStockHistory = typeof product_stock_history.$inferSelect;
