// src/actions/iuran.ts
'use server';

import { db } from '@/db';
import { members, monthlyDues, transactions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// 1. Get Data Matrix Iuran per Tahun
export async function fetchIuranMatrix(year: number) {
  try {
    // Ambil semua anggota yang aktif
    const allMembers = await db.select().from(members).where(eq(members.status, 'active')).orderBy(members.name);
    // Ambil semua data iuran di tahun yang dipilih
    const allDues = await db.select().from(monthlyDues).where(eq(monthlyDues.year, year));

    // Rakit datanya jadi bentuk matriks biar gampang di-render di frontend
    return allMembers.map(member => {
      const memberDues = allDues.filter(d => d.memberId === member.id);

      const months = Array.from({ length: 12 }, (_, i) => {
        const monthNum = i + 1;
        const due = memberDues.find(d => d.month === monthNum);
        return {
          month: monthNum,
          isPaid: !!due,
          dueId: due?.id
        };
      });

      return { ...member, months };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 2. Fungsi Toggle (Lunas <-> Belum)
// src/actions/iuran.ts (Ubah fungsi toggleIuran aja)

export async function toggleIuran(memberId: number, month: number, year: number, isCurrentlyPaid: boolean) {
  try {
    // Cari nama anggota dulu buat deskripsi transaksi
    const memberData = await db.select().from(members).where(eq(members.id, memberId)).limit(1);
    const memberName = memberData[0]?.name || 'Anggota';

    // Bikin string deskripsi unik biar gampang dicari kalo mau dihapus
    const trxDesc = `Iuran Bln ${month}/${year} - ${memberName}`;

    if (isCurrentlyPaid) {
      // 1. Hapus status lunas dari matriks
      await db.delete(monthlyDues).where(
        and(
          eq(monthlyDues.memberId, memberId),
          eq(monthlyDues.month, month),
          eq(monthlyDues.year, year)
        )
      );

      // 2. OTOMATIS: Hapus juga transaksi pemasukannya dari Buku Kas!
      await db.delete(transactions).where(
        and(
          eq(transactions.memberId, memberId),
          eq(transactions.description, trxDesc)
        )
      );

    } else {
      // 1. Catat status lunas di matriks (fix 30rb)
      await db.insert(monthlyDues).values({ memberId, month, year, amount: 30000 });

      // 2. OTOMATIS: Masukin uang 30rb nya ke Buku Kas!
      await db.insert(transactions).values({
        type: 'income',
        amount: 30000,
        description: trxDesc,
        memberId: memberId, // Kita simpen ID membernya biar ngelink
      });
    }

    // Refresh halaman iuran, transaksi, dan dashboard biar angkanya update semua
    revalidatePath('/dashboard/iuran');
    revalidatePath('/dashboard/transaksi');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error("🔥 ERROR TOGGLE IURAN:", error);
    return { error: `Gagal: ${error.message}` };
  }
}