import {
  doublePrecision,
  integer,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import {
  AEDAvailabilityRules,
  AEDDisclaimers,
  AEDLocation,
} from "./types";

export const aed = pgTable("aed", {
  id: integer("id").primaryKey(),
  location: json("location").$type<AEDLocation>(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  location_type: text("location_type").notNull(),
  availabilityRules: json(
    "availabilityRules"
  ).$type<AEDAvailabilityRules>(),
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
  disclaimers: json("disclaimers").$type<AEDDisclaimers>(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
