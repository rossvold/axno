import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Lookup table for product storage/brand types (e.g. Rørosmeieriet, Kolonihagen)
export const product_brand = sqliteTable("product_brand", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Productbrand = typeof product_brand.$inferSelect;
