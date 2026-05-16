// src/actions/dashboard.ts
'use server';

import { db } from '@/db';
import { transactions, members } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function getDashboardMetrics() {
  try {
    const allTransactions = await db.select().from(transactions).orderBy(desc(transactions.date));

    const activeMembers = await db
      .select({ count: sql<number>`count(*)` })
      .from(members)
      .where(eq(members.status, 'active'));

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // ── Prev month reference ──────────────────────────────────────────────────
    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();

    // ── Accumulators ──────────────────────────────────────────────────────────
    let totalIncome = 0;
    let totalExpense = 0;

    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let prevMonthlyIncome = 0;
    let prevMonthlyExpense = 0;

    // 7-month bar chart buckets (index 0 = 6 months ago, index 6 = current month)
    const barIncome: number[] = Array(7).fill(0);
    const barExpense: number[] = Array(7).fill(0);

    let todayCount = 0;

    allTransactions.forEach((trx) => {
      const d = new Date(trx.date);
      const m = d.getMonth();
      const y = d.getFullYear();

      const isCurrentMonth = m === currentMonth && y === currentYear;
      const isPrevMonth = m === prevMonth && y === prevYear;

      // Overall saldo
      if (trx.type === 'income') {
        totalIncome += trx.amount;
        if (isCurrentMonth) monthlyIncome += trx.amount;
        if (isPrevMonth) prevMonthlyIncome += trx.amount;
      } else {
        totalExpense += trx.amount;
        if (isCurrentMonth) monthlyExpense += trx.amount;
        if (isPrevMonth) prevMonthlyExpense += trx.amount;
      }

      // Today count
      if (
        d.getDate() === now.getDate() &&
        m === currentMonth &&
        y === currentYear
      ) {
        todayCount++;
      }

      // Bar chart: last 7 months
      for (let i = 0; i < 7; i++) {
        const target = new Date(currentYear, currentMonth - (6 - i), 1);
        if (m === target.getMonth() && y === target.getFullYear()) {
          if (trx.type === 'income') barIncome[i] += trx.amount;
          else barExpense[i] += trx.amount;
        }
      }
    });

    const saldoTotal = totalIncome - totalExpense;

    // ── Growth % helpers ──────────────────────────────────────────────────────
    const growthPct = (current: number, prev: number): number | null => {
      if (prev === 0) return null;
      return Math.round(((current - prev) / prev) * 100);
    };

    const incomeGrowth = growthPct(monthlyIncome, prevMonthlyIncome);
    const expenseGrowth = growthPct(monthlyExpense, prevMonthlyExpense);

    // ── Iuran stats (transaksi yg descriptionnya "Iuran Bln") ─────────────────
    const iuranCurrentMonth = allTransactions.filter((t) => {
      const d = new Date(t.date);
      return (
        t.description.startsWith('Iuran Bln') &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    }).length;

    const totalAnggota = Number(activeMembers[0].count);
    // Persentase iuran terkumpul bulan ini (dari anggota aktif)
    const iuranPct = totalAnggota > 0
      ? Math.min(100, Math.round((iuranCurrentMonth / totalAnggota) * 100))
      : 0;

    // Anggota yang belum bayar iuran bulan ini
    const iuranTertunda = Math.max(0, totalAnggota - iuranCurrentMonth);

    // ── 7-month bar label (e.g. "Nov", "Des", …) ─────────────────────────────
    const barLabels: string[] = Array(7)
      .fill(null)
      .map((_, i) => {
        const d = new Date(currentYear, currentMonth - (6 - i), 1);
        return d.toLocaleDateString('id-ID', { month: 'short' });
      });

    // ── Format ────────────────────────────────────────────────────────────────
    const formatRp = (n: number) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(n);

    return {
      // Existing fields (unchanged shape — page masih kompatibel)
      saldo: formatRp(saldoTotal),
      pemasukanBulanIni: formatRp(monthlyIncome),
      pengeluaranBulanIni: formatRp(monthlyExpense),
      anggotaAktif: totalAnggota,
      recentTransactions: allTransactions.slice(0, 5),

      // New computed fields
      saldoRaw: saldoTotal,
      monthlyIncomeRaw: monthlyIncome,
      monthlyExpenseRaw: monthlyExpense,
      incomeGrowth,         // number | null  (% vs bulan lalu)
      expenseGrowth,        // number | null
      todayTransactionCount: todayCount,
      iuranPct,             // 0–100
      iuranTertunda,        // jumlah anggota belum bayar
      barIncome,            // number[7] — nominal per bulan
      barExpense,           // number[7] — nominal per bulan
      barLabels,            // string[7] — label bulan singkat
    };
  } catch (error) {
    console.error(error);
    return {
      saldo: 'Rp 0',
      pemasukanBulanIni: 'Rp 0',
      pengeluaranBulanIni: 'Rp 0',
      anggotaAktif: 0,
      recentTransactions: [],
      saldoRaw: 0,
      monthlyIncomeRaw: 0,
      monthlyExpenseRaw: 0,
      incomeGrowth: null,
      expenseGrowth: null,
      todayTransactionCount: 0,
      iuranPct: 0,
      iuranTertunda: 0,
      barIncome: Array(7).fill(0),
      barExpense: Array(7).fill(0),
      barLabels: Array(7).fill(''),
    };
  }
}