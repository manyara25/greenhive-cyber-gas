CREATE TABLE "admins" (
	"id" serial PRIMARY KEY,
	"username" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"service" text NOT NULL,
	"message" text,
	"status" text DEFAULT 'New' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
