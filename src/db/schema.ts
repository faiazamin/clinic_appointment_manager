import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const clinics = sqliteTable('clinics', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const patients = sqliteTable('patients', {
  id: text('id').primaryKey(),
  clinicId: text('clinic_id').notNull().references(() => clinics.id),
  name: text('name').notNull(),
  age: integer('age'),
  contact: text('contact'),
});

export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey(),
  clinicId: text('clinic_id').notNull().references(() => clinics.id),
  patientId: text('patient_id').notNull().references(() => patients.id),
  date: text('date').notNull(),
  reason: text('reason'),
});
