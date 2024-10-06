import { pgTable, serial, text, integer, json, doublePrecision, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const todo = pgTable("todo", {
	id: serial("id").primaryKey().notNull(),
	title: text("title").notNull(),
	description: text("description"),
});

export const aed = pgTable("aed", {
	id: integer("id").primaryKey().notNull(),
	location: json("location"),
	locationType: text("location_type").notNull(),
	availabilityRules: json("availabilityRules"),
	availabilityDetails: text("availabilityDetails").notNull(),
	slug: text("slug").notNull(),
	title: text("title").notNull(),
	created: text("created").notNull(),
	modified: text("modified").notNull(),
	userEmail: text("userEmail").notNull(),
	userName: text("userName").notNull(),
	address: text("address").notNull(),
	postalCode: text("postalCode").notNull(),
	city: text("city").notNull(),
	contactPerson: text("contactPerson").notNull(),
	phoneNumber: text("phoneNumber").notNull(),
	addressDetails: text("addressDetails").notNull(),
	disclaimers: json("disclaimers"),
	lat: doublePrecision("lat").notNull(),
	lng: doublePrecision("lng").notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).defaultNow().notNull(),
});