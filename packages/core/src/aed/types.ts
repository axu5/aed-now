import { z } from "zod";

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

export const AEDAvailabilityRulesSchema = z.array(
  z.union([
    z.object({
      type: z.literal("weekday"),
      available: z.boolean(),
      days: z.array(
        z.union([
          z.literal("Monday"),
          z.literal("Tuesday"),
          z.literal("Wednesday"),
          z.literal("Thursday"),
          z.literal("Friday"),
          z.literal("Saturday"),
          z.literal("Sunday"),
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

export const AEDDataSchema = z.object({
  id: z.number(),
  location: AEDLocationSchema,
  location_type: z.string(),
  availabilityRules: AEDAvailabilityRulesSchema,
  availabilityDetails: z.string(),
  slug: z.string(),
  title: z.string(),
  created: AEDDateFormatWithTimeSchema,
  modified: AEDDateFormatWithTimeSchema,
  userEmail: z.string(),
  userName: z.string(),
  address: z.string(),
  postalCode: z.string(),
  city: z.string(),
  contactPerson: z.string(),
  phoneNumber: z.string(),
  addressDetails: z.string(),
  disclaimers: AEDDisclaimersSchema,
});
export type AEDData = z.infer<typeof AEDDataSchema>;
