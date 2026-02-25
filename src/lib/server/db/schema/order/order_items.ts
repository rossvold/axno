// This schema tracks individual items within an order
// Each row represents one product/item in an order
import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { order } from "./order";
import { product } from "./product";
import { order_items_status } from "./order_items_status";
import { product_stock } from "./product_stock";

export const order_items = sqliteTable("order_items", {
  id: text("id").primaryKey(), // uuid
  order_id: text("order_id").notNull().references(() => order.id), // Foreign ref to P000.order
  product_id: text("product_id").notNull().references(() => product.id), // Foreign ref to P000.product
  product_stock_id: text("product_stock_id").references(() => product_stock.id), // Foreign ref to P000.product_stock (nullable for regular products)
  user_id: text("user_id").notNull(), // Foreign ref to S001 (for security/validation)
  order_items_status: text("order_items_status").references(() => order_items_status.id),
	// Item details
  quantity: integer("quantity").notNull(),
  unit_price: text("unit_price").notNull(), // Price per unit at time of order
  line_price: text("line_price").notNull(), // Total price for this line (quantity * unit_price)
  note: text("note"), // Total price for this line (quantity * unit_price)
	// Meta info
	created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updated_at: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type OrderItem = typeof order_items.$inferSelect;
export type NewOrderItem = typeof order_items.$inferInsert;
