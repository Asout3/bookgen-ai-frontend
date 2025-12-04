CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`genre` text NOT NULL,
	`audience` text NOT NULL,
	`description` text NOT NULL,
	`tone` text NOT NULL,
	`style` text NOT NULL,
	`chapters` integer NOT NULL,
	`words_per_chapter` integer NOT NULL,
	`total_words` integer NOT NULL,
	`status` text DEFAULT 'completed' NOT NULL,
	`content` text,
	`cover_url` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
