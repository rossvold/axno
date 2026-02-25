import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const order_items_status = sqliteTable("order_items_status", {
  id: text("id").primaryKey(), // UUID for external references
	name: text("name"),
	// Date fields
	created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updated_at: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type order_items_status = typeof order_items_status.$inferSelect;
