import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from '../auth.schema';

export const adminRequestComments = sqliteTable("admin_request_comments", {
  id: text("id").primaryKey(),
  request_id: text("request_id").notNull(), // References admin_requests.id
	user_id: text('user_id').notNull().references(() => user.id),
  comment: text("comment").notNull(),
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type AdminRequestComments = typeof adminRequestComments.$inferSelect;

