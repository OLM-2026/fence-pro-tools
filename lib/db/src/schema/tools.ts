import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const toolsTable = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  pricingStartsAt: text("pricing_starts_at"),
  pros: text("pros").array().notNull().default([]),
  cons: text("cons").array().notNull().default([]),
  affiliateUrl: text("affiliate_url"),
  logoUrl: text("logo_url"),
  featured: boolean("featured").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  freeTrial: boolean("free_trial").notNull().default(false),
  mobileApp: boolean("mobile_app").notNull().default(false),
  bestFor: text("best_for"),
  integrations: text("integrations").array().notNull().default([]),
  rating: text("rating"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertToolSchema = createInsertSchema(toolsTable).omit({ id: true, createdAt: true });
export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof toolsTable.$inferSelect;
