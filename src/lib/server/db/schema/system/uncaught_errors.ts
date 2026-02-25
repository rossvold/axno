import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { user } from "../user/user";

export const uncaught_errors = sqliteTable("uncaught_errors", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  stack: text("stack"),
  route: text("route").notNull(),
	user_id: text('user_id').references(() => user.id), // nullable when error occurs before auth or when user is unknown
  environment: text("environment").notNull(),
  http_status: integer("http_status").notNull(),
  error_type: text("error_type").notNull().default("server_error"),
  caught: integer("caught", { mode: 'boolean' }).notNull().default(false),
  created_at: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export type UncaughtError = typeof uncaught_errors.$inferSelect;
