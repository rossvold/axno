import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from '../auth.schema';
import { order } from './order';
import { order_items } from './order_items';

export const order_history = sqliteTable('order_history', {
	id: text('id').primaryKey(), // UUID for unique identification
	order_id: text('order_id').notNull().references(() => order.id),
	order_items_id: text('order_items_id').references(() => order_items.id), // NULL for order-level changes
	action_type: text('action_type').notNull(), // 'status_change', 'delivery', 'pickup', 'cancellation', etc.
	previous_status: text('previous_status'),
	new_status: text('new_status'),
	performed_by_user_id: text('performed_by_user_id')
		.notNull()
		.references(() => user.id),
	performed_by_user_name: text('performed_by_user_name').notNull(),
	// Stock tracking (for delivery actions)
	stock_before: integer('stock_before'),
	stock_after: integer('stock_after'),
	quantity_affected: integer('quantity_affected'),
	// Additional context
	notes: text('notes'),
	system_message: text('system_message'),
	// Timestamps
	performed_at: integer('performed_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`)
});

export type OrderHistory = typeof order_history.$inferSelect;
export type NewOrderHistory = typeof order_history.$inferInsert;
