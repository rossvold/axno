import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const assertion = sqliteTable("assertion", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  error_message: text("error_message").notNull(),
  error_stack: text("error_stack"),
  environment: text("environment").notNull(),
  status: text("status").notNull().default('åpen'),
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type Assertion = typeof assertion.$inferSelect;
