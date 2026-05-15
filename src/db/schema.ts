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


export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone'),
  status: text('status').default('active'), 
  createdAt: timestamp('created_at').defaultNow(),
});


export const monthlyDues = pgTable('monthly_payments', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  month: integer('month').notNull(), 
  year: integer('year').notNull(),
  amount: integer('amount').default(30000).notNull(), 
  createdAt: timestamp('created_at').defaultNow(),
});

// src/db/schema.ts (Tambahin di paling bawah)

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'income' atau 'expense'
  amount: integer('amount').notNull(),
  description: text('description').notNull(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  
  // Opsional: Kalo transaksi ini asalnya dari iuran, kita catat siapa yang bayar
  memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }), 
  
  date: timestamp('date').defaultNow().notNull(),
});