// src/actions/dashboard.ts
'use server';

import { db } from '@/db';
import { transactions, members } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function getDashboardMetrics() {
  try {
    const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.date));
    
    const activeMembers = await db.select({ count: sql<number>`count(*)` }).from(members).where(eq(members.status, 'active'));

    let totalIncome = 0;
    let totalExpense = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let monthlyIncome = 0;
    let monthlyExpense = 0;

    allTransactions.forEach((trx) => {
      const trxDate = new Date(trx.date);
      const isCurrentMonth = trxDate.getMonth() === currentMonth && trxDate.getFullYear() === currentYear;

      if (trx.type === 'income') {
        totalIncome += trx.amount;
        if (isCurrentMonth) monthlyIncome += trx.amount;
      } else {
        totalExpense += trx.amount;
        if (isCurrentMonth) monthlyExpense += trx.amount;
      }
    });

    const saldoTotal = totalIncome - totalExpense;

    const formatRp = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    return {
      saldo: formatRp(saldoTotal),
      pemasukanBulanIni: formatRp(monthlyIncome),
      pengeluaranBulanIni: formatRp(monthlyExpense),
      anggotaAktif: Number(activeMembers[0].count),
      recentTransactions: allTransactions.slice(0, 5) 
    };

  } catch (error) {
    console.error(error);
    return {
      saldo: "Rp 0", pemasukanBulanIni: "Rp 0", pengeluaranBulanIni: "Rp 0", anggotaAktif: 0, recentTransactions: []
    };
  }
}