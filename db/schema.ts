import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial().primaryKey(),
  username: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const serviceRequests = pgTable("service_requests", {
  id: serial().primaryKey(),
  name: text().notNull(),
  phone: text().notNull(),
  service: text().notNull(),
  message: text(),
  status: text().notNull().default("New"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
