import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { aed } from "./aed.sql";

const AEDLocationSchema = z.object({
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
});
export type AEDLocation = z.infer<typeof AEDLocationSchema>;

const AEDDateFormatSchema = z
  .string()
  .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/);
export type AEDDateFormat = `${number}-${number}-${number}`;

const AEDDateFormatWithTimeSchema = z
  .string()
  .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/);
export type AEDDateFormatWithTime =
  `${number}-${number}-${number} ${number}:${number}:${number}`;

const AEDTimeFormatSchema = z.string().regex(/^[0-9]{2}:[0-9]{2}$/);
type AEDTimeFormat = `${number}:${number}`;

export const weekdays = [
  "Sunday" as const,
  "Monday" as const,
  "Tuesday" as const,
  "Wednesday" as const,
  "Thursday" as const,
  "Friday" as const,
  "Saturday" as const,
] as const;
export const AEDAvailabilityRulesSchema = z.array(
  z.union([
    z.object({
      type: z.literal("weekday"),
      available: z.boolean(),
      days: z.array(
        z.union([
          z.literal(weekdays[0]),
          z.literal(weekdays[1]),
          z.literal(weekdays[2]),
          z.literal(weekdays[3]),
          z.literal(weekdays[4]),
          z.literal(weekdays[5]),
          z.literal(weekdays[6]),
        ])
      ),
      from: AEDTimeFormatSchema,
      to: AEDTimeFormatSchema,
    }),
    z.object({
      type: z.literal("date"),
      available: z.boolean(),
      date: z.union([z.literal(""), AEDDateFormatSchema]),
      from: AEDTimeFormatSchema,
      to: AEDTimeFormatSchema,
    }),
    z.object({
      type: z.literal("range"),
      available: z.boolean(),
      from: z.union([
        AEDTimeFormatSchema,
        AEDDateFormatWithTimeSchema,
        z.string().max(0),
      ]),
      to: z.union([
        AEDTimeFormatSchema,
        AEDDateFormatWithTimeSchema,
        z.string().max(0),
      ]),
    }),
  ])
);
export type AEDAvailabilityRules = z.infer<
  typeof AEDAvailabilityRulesSchema
>;

const AEDDisclaimersSchema = z
  .array(
    z.union([
      z.literal("publish_contact"),
      z.literal("publish_phone"),
      z.literal("give_data_research"),
      z.literal("give_data_authorities"),
      z.literal("give_data_third_parties"),
    ])
  )
  .or(z.string().max(0));
export type AEDDisclaimers = z.infer<typeof AEDDisclaimersSchema>;

const overwrites = {
  availabilityRules: AEDAvailabilityRulesSchema,
  disclaimers: AEDDisclaimersSchema,
};

export const AEDInsertSchema = createInsertSchema(aed, overwrites);
export type AEDInsert = z.infer<typeof AEDInsertSchema>;
export const AEDSelectSchema = createSelectSchema(aed, overwrites);
export type AEDSelect = z.infer<typeof AEDSelectSchema>;
