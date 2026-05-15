// src/actions/member.ts
'use server';

import { db } from '@/db';
import { members } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function fetchMembers() {
  try {
    return await db.select().from(members).orderBy(desc(members.createdAt));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addMember(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const status = formData.get('status') as string;

  if (!name) return { error: 'Nama anggota wajib diisi bre!' };

  try {
    await db.insert(members).values({ name, phone, status });
    revalidatePath('/dashboard/anggota'); 
    return { success: true, message: 'Anggota baru berhasil ditambah!' };
  } catch (error) {
    return { error: 'Gagal nyimpen data ke database.' };
  }
}

export async function editMember(prevState: any, formData: FormData) {
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const status = formData.get('status') as string;

  if (!id || !name) return { error: 'Data nama tidak boleh kosong!' };

  try {
    await db.update(members)
      .set({ name, phone, status })
      .where(eq(members.id, id));
      
    revalidatePath('/dashboard/anggota');
    return { success: true, message: 'Data anggota berhasil diperbarui!' };
  } catch (error) {
    return { error: 'Gagal update ke database.' };
  }
}

export async function deleteMember(id: number) {
  try {
    await db.delete(members).where(eq(members.id, id));
    revalidatePath('/dashboard/anggota');
    return { success: true, message: 'Anggota berhasil dihapus!' };
  } catch (error) {
    return { error: 'Gagal! Anggota ini mungkin udah punya riwayat transaksi.' };
  }
}