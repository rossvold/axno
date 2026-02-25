import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const emails_sent = sqliteTable("emails_sent", {
	id: text("id").primaryKey(),
	from: text("from").notNull(),
	to: text("to").notNull(), // JSON string of recipient array
	subject: text("subject").notNull(),
	html: text("html").notNull(),
	sent_at: integer("sent_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
	status: text("status").notNull().default("sent"),
});

export type EmailsSent = typeof emails_sent.$inferSelect;
