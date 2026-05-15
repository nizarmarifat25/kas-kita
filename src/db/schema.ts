// src/db/schema.ts
   import { pgTable, serial, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

   export const roleEnum = pgEnum('role', ['admin', 'member']);
   export const typeEnum = pgEnum('type', ['income', 'expense']);

   export const users = pgTable('users', {
     id: serial('id').primaryKey(),
     name: text('name').notNull(),
     email: text('email').unique().notNull(),
     password: text('password').notNull(),
     role: roleEnum('role').default('member').notNull(),
     createdAt: timestamp('created_at').defaultNow(),
   });

   export const categories = pgTable('categories', {
     id: serial('id').primaryKey(),
     name: text('name').notNull(),
     type: typeEnum('type').notNull(),
   });

   export const transactions = pgTable('transactions', {
     id: serial('id').primaryKey(),
     amount: integer('amount').notNull(),
     date: timestamp('date').notNull(),
     description: text('description'),
     categoryId: integer('category_id').references(() => categories.id).notNull(),
     userId: integer('user_id').references(() => users.id),
     createdAt: timestamp('created_at').defaultNow(),
   });

   export const monthlyPayments = pgTable('monthly_payments', {
     id: serial('id').primaryKey(),
     userId: integer('user_id').references(() => users.id).notNull(),
     month: integer('month').notNull(),
     year: integer('year').notNull(),
     isPaid: boolean('is_paid').default(false).notNull(),
     transactionId: integer('transaction_id').references(() => transactions.id),
   });