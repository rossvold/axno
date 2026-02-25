// This schema is to document the individual order, but will !NOT! track
// the items included in this order, to find products associated with this
// look at order_items
import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { user } from '../auth.schema';
import { order_status } from './order_status';

export const order = sqliteTable('order', {
	order_number: integer('order_number').primaryKey(), // AUTOINCREMENT starting from 100001
	id: text('id').notNull().unique(), // UUID for external references
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	order_status: text('order_status').references(() => order_status.id),
	order_by: text('order_by'),
	// Meta info about this order (all prices in øre)
	total_price_ore: integer('total_price_ore'),
	shipping_price_ore: integer('shipping_price_ore'),
	item_amount_ore: integer('item_amount_ore'),
	payment_method: text('payment_method'),
	// Date fields
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
	order_sent: integer('order_sent', { mode: 'timestamp' }),
	// Delivery details
	delivery_email: text('delivery_email'),
	delivery_phone: text('delivery_phone'),
	delivery_address: text('delivery_address'),
	delivery_zip: text('delivery_zip'),
	delivery_city: text('delivery_city'),
	delivery_pickup_point: text('delivery_pickup_point'),
	delivery_note: text('delivery_note'),
	delivery_estimated_date: integer('delivery_estimated_date', { mode: 'timestamp' }),
	delivery_method: text('delivery_method')
});

export type Order = typeof order.$inferSelect;
export type NewOrder = typeof order.$inferInsert;
