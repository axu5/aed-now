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
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  location_type: text("location_type"),
  availabilityRules: json(
    "availabilityRules"
  ).$type<AEDAvailabilityRules>(),
  availabilityDetails: text("availabilityDetails"),
  slug: text("slug"),
  title: text("title"),
  created: text("created"),
  modified: text("modified"),
  userEmail: text("userEmail"),
  userName: text("userName"),
  address: text("address"),
  postalCode: text("postalCode"),
  city: text("city"),
  contactPerson: text("contactPerson"),
  phoneNumber: text("phoneNumber"),
  addressDetails: text("addressDetails"),
  disclaimers: json("disclaimers").$type<AEDDisclaimers>(),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
