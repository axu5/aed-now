CREATE TABLE IF NOT EXISTS "aed" (
	"id" integer PRIMARY KEY NOT NULL,
	"location" json,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"location_type" text NOT NULL,
	"availabilityRules" json,
	"availabilityDetails" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"created" text NOT NULL,
	"modified" text NOT NULL,
	"userEmail" text NOT NULL,
	"userName" text NOT NULL,
	"address" text NOT NULL,
	"postalCode" text NOT NULL,
	"city" text NOT NULL,
	"contactPerson" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"addressDetails" text NOT NULL,
	"disclaimers" json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text
);
