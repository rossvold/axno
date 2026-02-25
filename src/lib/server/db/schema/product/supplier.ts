import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const productSupplier = sqliteTable("product_supplier", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  grosisst: text("grosisst"),
  note: text("note"),
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type ProductDelivery = typeof productSupplier.$inferSelect;
