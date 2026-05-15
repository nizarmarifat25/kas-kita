// src/actions/transaksi.ts
'use server';

import { db } from '@/db';
import { transactions, categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 1. Ambil Data Transaksi (Join dengan Kategori)
export async function fetchTransactions() {
  try {
    return await db.select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      date: transactions.date,
      categoryName: categories.name,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .orderBy(desc(transactions.date));
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 2. Tambah Transaksi Manual
export async function addTransaction(prevState: any, formData: FormData) {
  const type = formData.get('type') as 'income' | 'expense';
  const amountStr = formData.get('amount') as string;
  const description = formData.get('description') as string;
  const categoryIdStr = formData.get('categoryId') as string;

  const amount = parseInt(amountStr.replace(/[^0-9]/g, ''), 10);
  const categoryId = categoryIdStr ? parseInt(categoryIdStr, 10) : null;

  if (!type || !amount || !description) return { error: 'Semua kolom wajib diisi bre!' };

  try {
    await db.insert(transactions).values({
      type, amount, description, categoryId
    });
    
    revalidatePath('/dashboard/transaksi');
    revalidatePath('/dashboard');
    return { success: true, message: 'Transaksi berhasil dicatat!' };
  } catch (error) {
    return { error: 'Gagal nyatet transaksi ke database.' };
  }
}

export async function deleteTransaction(id: number) {
  try {
    await db.delete(transactions).where(eq(transactions.id, id));
    revalidatePath('/dashboard/transaksi');
    revalidatePath('/dashboard');
    return { success: true, message: 'Transaksi berhasil dihapus!' };
  } catch (error) {
    return { error: 'Gagal menghapus transaksi.' };
  }
}