import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { order } from "./order";
import { order_items } from "./order_items";

export const order_history = sqliteTable("order_history", {
  id: text("id").primaryKey(), // UUID for unique identification
  order_id: text("order_id").notNull().references(() => order.id), // Foreign key to order
  order_items_id: text("order_items_id").references(() => order_items.id), // Foreign key to order_items (NULL for order-level changes)
  action_type: text("action_type").notNull(), // 'status_change', 'delivery', 'pickup', 'cancellation', etc.
  previous_status: text("previous_status"), // Previous status before change
  new_status: text("new_status"), // New status after change
  performed_by_user_id: text("performed_by_user_id").notNull(), // Admin user ID who performed the action (references S001.user.id)
  performed_by_user_name: text("performed_by_user_name").notNull(), // Admin user name who performed the action
  // Stock tracking (for delivery actions)
  stock_before: integer("stock_before"), // Stock level before action
  stock_after: integer("stock_after"), // Stock level after action
  quantity_affected: integer("quantity_affected"), // Quantity affected by the action
  // Additional context
  notes: text("notes"), // Optional notes about the action
  system_message: text("system_message"), // System-generated message
  // Timestamps
  performed_at: integer("performed_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type OrderHistory = typeof order_history.$inferSelect;
export type NewOrderHistory = typeof order_history.$inferInsert;
