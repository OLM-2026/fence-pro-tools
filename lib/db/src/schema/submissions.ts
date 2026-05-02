import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const submissionsTable = pgTable("tool_submissions", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  toolName: text("tool_name").notNull(),
  category: text("category").notNull(),
  website: text("website").notNull(),
  contactEmail: text("contact_email").notNull(),
  whyFencing: text("why_fencing").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSubmissionSchema = createInsertSchema(submissionsTable).omit({ id: true, createdAt: true });
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissionsTable.$inferSelect;
