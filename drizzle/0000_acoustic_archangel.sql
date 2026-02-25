CREATE TABLE `entity_audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`field_name` text NOT NULL,
	`old_value` text,
	`new_value` text,
	`user_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE TABLE `emails_sent` (
	`id` text PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`subject` text NOT NULL,
	`html` text NOT NULL,
	`sent_at` integer DEFAULT (unixepoch()) NOT NULL,
	`status` text DEFAULT 'sent' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `assertion` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`error_message` text NOT NULL,
	`error_stack` text,
	`environment` text NOT NULL,
	`status` text DEFAULT 'åpen' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `uncaught_errors` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`stack` text,
	`route` text NOT NULL,
	`user_id` text,
	`environment` text NOT NULL,
	`http_status` integer NOT NULL,
	`error_type` text DEFAULT 'server_error' NOT NULL,
	`caught` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `admin_request_activity_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`user_id` text NOT NULL,
	`field_name` text NOT NULL,
	`old_value` text,
	`new_value` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `admin_request_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`request_id` text NOT NULL,
	`user_id` text NOT NULL,
	`comment` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `admin_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text DEFAULT 'other' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`location` text,
	`created_by` text NOT NULL,
	`assigned_to` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sms_sent` (
	`id` text PRIMARY KEY NOT NULL,
	`to` text NOT NULL,
	`body` text NOT NULL,
	`sent_at` integer DEFAULT (unixepoch()) NOT NULL,
	`status` text DEFAULT 'sent' NOT NULL,
	`provider` text,
	`external_id` text,
	`user_id` text
);
--> statement-breakpoint
CREATE TABLE `product` (
	`product_number` integer PRIMARY KEY NOT NULL,
	`id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`dosage_usage` text,
	`ingredients` text,
	`nutritional_content` text,
	`opprinnelsesland` text,
	`is_new` integer DEFAULT false NOT NULL,
	`image_link` text,
	`website_link` text,
	`supplier_id` text,
	`brand_id` text,
	`bestillingsvare` integer DEFAULT false NOT NULL,
	`bestillingsvare_leveringstid` text,
	`bestillings_enhet` text,
	`bought` integer DEFAULT 0,
	`rating` real DEFAULT 0 NOT NULL,
	`reviews` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`subscription` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `product_supplier`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brand_id`) REFERENCES `product_brand`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_id_unique` ON `product` (`id`);--> statement-breakpoint
CREATE TABLE `product_category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_brand` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_supplier` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`email` text,
	`phone` text,
	`address` text,
	`grosisst` text,
	`note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_category_relation` (
	`product_id` text NOT NULL,
	`category_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`product_id`, `category_id`),
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `product_category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_stock` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`amount` real,
	`unit` text,
	`variant_label` text,
	`price_ore` integer DEFAULT 0 NOT NULL,
	`discount_percent` integer,
	`stock_real` integer DEFAULT 0 NOT NULL,
	`stock_order` integer DEFAULT 0 NOT NULL,
	`stock_processing` integer DEFAULT 0,
	`stock_minimum` integer DEFAULT 0,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_stock_history` (
	`id` text PRIMARY KEY NOT NULL,
	`product_stock_id` text NOT NULL,
	`field_changed` text NOT NULL,
	`amount_changed` integer NOT NULL,
	`value_before` integer NOT NULL,
	`value_after` integer NOT NULL,
	`user_id` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`product_stock_id`) REFERENCES `product_stock`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order` (
	`order_number` integer PRIMARY KEY NOT NULL,
	`id` text NOT NULL,
	`user_id` text NOT NULL,
	`order_status` text,
	`order_by` text,
	`total_price_ore` integer,
	`shipping_price_ore` integer,
	`item_amount_ore` integer,
	`payment_method` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`order_sent` integer,
	`delivery_email` text,
	`delivery_phone` text,
	`delivery_address` text,
	`delivery_zip` text,
	`delivery_city` text,
	`delivery_pickup_point` text,
	`delivery_note` text,
	`delivery_estimated_date` integer,
	`delivery_method` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_status`) REFERENCES `order_status`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `order_id_unique` ON `order` (`id`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`product_stock_id` text,
	`user_id` text NOT NULL,
	`order_items_status` text,
	`quantity` integer NOT NULL,
	`unit_price_ore` integer NOT NULL,
	`line_price_ore` integer NOT NULL,
	`note` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_stock_id`) REFERENCES `product_stock`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_items_status`) REFERENCES `order_items_status`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_history` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`order_items_id` text,
	`action_type` text NOT NULL,
	`previous_status` text,
	`new_status` text,
	`performed_by_user_id` text NOT NULL,
	`performed_by_user_name` text NOT NULL,
	`stock_before` integer,
	`stock_after` integer,
	`quantity_affected` integer,
	`notes` text,
	`system_message` text,
	`performed_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_items_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`performed_by_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_status` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items_status` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
