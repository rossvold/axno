import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const smsSent = sqliteTable('sms_sent', {
	id: text('id').primaryKey(),
	to: text('to').notNull(),
	body: text('body').notNull(),
	sent_at: integer('sent_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	status: text('status').notNull().default('sent'),
	provider: text('provider'),
	external_id: text('external_id'),
	user_id: text('user_id')
});

export type SmsSent = typeof smsSent.$inferSelect;
export type SmsSentInsert = typeof smsSent.$inferInsert;
