import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const productCategory = sqliteTable("product_category", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type ProductCategory = typeof productCategory.$inferSelect;
