import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from '../auth.schema';

export const adminRequestActivityLogs = sqliteTable("admin_request_activity_logs", {
  id: text("id").primaryKey(),
  request_id: text("request_id").notNull(), // References admin_requests.id
	user_id: text('user_id').notNull().references(() => user.id),
  field_name: text("field_name").notNull(), // e.g., "status", "title", "assigned_to", "category", "location", "description"
  old_value: text("old_value"), // Previous value (nullable)
  new_value: text("new_value"), // New value (nullable)
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type AdminRequestActivityLogs = typeof adminRequestActivityLogs.$inferSelect;

