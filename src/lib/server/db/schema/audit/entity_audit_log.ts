import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from '../auth.schema';

export const entityAuditLog = sqliteTable('entity_audit_log', {
	id: text('id').primaryKey(),
	entity_type: text('entity_type').notNull(), // 'product' | 'order' | 'order_item'
	entity_id: text('entity_id').notNull(),
	field_name: text('field_name').notNull(),
	old_value: text('old_value'), // Serialized previous value
	new_value: text('new_value'), // Serialized new value
	user_id: text('user_id').references(() => user.id),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});

export type EntityAuditLog = typeof entityAuditLog.$inferSelect;
