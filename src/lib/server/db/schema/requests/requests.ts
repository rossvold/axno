import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const adminRequests = sqliteTable("admin_requests", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["feature_request", "bug", "feedback", "question", "other"] }).notNull().default("other"),
  status: text("status", { enum: ["open", "in_progress", "planlagt", "closed"] }).notNull().default("open"),
  location: text("location"), // Human-readable Norwegian name of the page/route
  created_by: text("created_by").notNull(), // References S001.user.id
  assigned_to: text("assigned_to"), // References S001.user.id (for you)
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type AdminRequests = typeof adminRequests.$inferSelect;

