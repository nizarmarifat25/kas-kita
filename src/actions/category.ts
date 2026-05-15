// src/actions/category.ts
'use server';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 1. Fungsi Get Data Kategori
export async function fetchCategories() {
  try {
    // Ngambil semua data dan diurutin dari yang terbaru
    return await db.select().from(categories).orderBy(desc(categories.id));
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 2. Fungsi Tambah Kategori (Dipanggil dari Form)
export async function addCategory(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'income' | 'expense';

  if (!name || !type) {
    return { error: 'Nama dan Tipe kategori wajib diisi!' };
  }

  try {
    await db.insert(categories).values({ name, type });
    // Refresh halaman otomatis
    revalidatePath('/dashboard/kategori'); 
    return { success: true, message: 'Kategori berhasil ditambah!' };
  } catch (error) {
    return { error: 'Gagal nyimpen ke database.' };
  }
}

// 3. Fungsi Hapus Kategori
export async function deleteCategory(id: number) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath('/dashboard/kategori');
    return { success: true, message: 'Kategori berhasil dihapus!' };
  } catch (error) {
    // Biasanya error kalo kategori ini udah kepake di tabel transaksi (Relasi DB)
    return { error: 'Gagal! Kategori ini masih dipake di data transaksi.' };
  }
}

export async function editCategory(prevState: any, formData: FormData) {
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'income' | 'expense';

  if (!id || !name || !type) {
    return { error: 'Data tidak lengkap!' };
  }

  try {
    await db.update(categories)
      .set({ name, type })
      .where(eq(categories.id, id));
      
    revalidatePath('/dashboard/kategori');
    return { success: true, message: 'Kategori berhasil diperbarui!' };
  } catch (error) {
    return { error: 'Gagal update ke database.' };
  }
}