// src/app/dashboard/iuran/page.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { fetchIuranMatrix, toggleIuran } from "@/actions/iuran";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { CalendarCheck, Check, Plus, Loader2 } from "lucide-react";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export default function IuranPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State buat nandain cell mana yang lagi di-klik (loading per cell)
  const [processingCell, setProcessingCell] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async (year: number) => {
    setIsLoading(true);
    try {
      const res = await fetchIuranMatrix(year);
      setData(res);
    } finally {
      setIsLoading(false);
    }
  };

  // Reload data tiap ganti tahun
  useEffect(() => {
    loadData(selectedYear);
  }, [selectedYear]);

  // Fungsi pas cell diklik
  const handleToggle = (
    memberId: number,
    month: number,
    isCurrentlyPaid: boolean,
  ) => {
    const cellKey = `${memberId}-${month}`;
    setProcessingCell(cellKey); // Set loading spesifik di cell ini

    startTransition(async () => {
      const res = await toggleIuran(
        memberId,
        month,
        selectedYear,
        isCurrentlyPaid,
      );
      if (res.success) {
        // Biar ga kelihatan kedip, kita update state lokal juga (Optimistic Update tipis-tipis)
        setData((prev) =>
          prev.map((member) => {
            if (member.id === memberId) {
              return {
                ...member,
                months: member.months.map((m: any) =>
                  m.month === month ? { ...m, isPaid: !isCurrentlyPaid } : m,
                ),
              };
            }
            return member;
          }),
        );
        toast.success(
          isCurrentlyPaid ? "Status dibatalkan" : "Iuran Lunas! (Rp 30.000)",
        );
      } else {
        toast.error(res.error);
      }
      setProcessingCell(null);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <CalendarCheck className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">
              Tracking
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Iuran Bulanan
          </h1>
          <p className="text-zinc-500 mt-2 text-base">
            Klik kotak bulan buat nandain lunas (Fix Rp 30.000 / bulan).
          </p>
        </div>

        {/* Filter Tahun */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-zinc-500">Tahun:</span>
          <Select
            value={selectedYear.toString()}
            onValueChange={(val) => setSelectedYear(parseInt(val))}
          >
            <SelectTrigger className="w-[120px] h-11 rounded-xl bg-white border-zinc-200 focus:ring-primary/20 font-bold text-zinc-900 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg border-zinc-100">
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <SelectItem
                  key={y}
                  value={y.toString()}
                  className="font-semibold"
                >
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabel Matriks */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="min-w-max">
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent border-zinc-200">
                {/* Kolom Nama Sticky */}
                <TableHead className="sticky left-0 z-20 bg-zinc-50/95 backdrop-blur-sm w-[250px] min-w-[250px] text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4 border-r border-zinc-200/50 shadow-[2px_0_10px_rgb(0,0,0,0.02)]">
                  Nama Anggota
                </TableHead>
                {/* Header Bulan */}
                {MONTH_NAMES.map((month) => (
                  <TableHead
                    key={month}
                    className="text-center w-[70px] min-w-[70px] text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4"
                  >
                    {month}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                // Skeleton Loading
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-zinc-100">
                    <TableCell className="sticky left-0 z-20 bg-white py-4 border-r border-zinc-200/50 shadow-[2px_0_10px_rgb(0,0,0,0.02)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 animate-pulse" />
                        <div className="h-4 bg-zinc-100 rounded animate-pulse w-24" />
                      </div>
                    </TableCell>
                    {MONTH_NAMES.map((_, i) => (
                      <TableCell key={i} className="py-4 text-center">
                        <div className="w-8 h-8 bg-zinc-100 rounded-lg mx-auto animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                // Empty State
                <TableRow>
                  <TableCell
                    colSpan={13}
                    className="h-[200px] text-center text-zinc-500 font-medium"
                  >
                    Belum ada anggota aktif bre. Tambah anggota dulu gih.
                  </TableCell>
                </TableRow>
              ) : (
                // Data Asli
                data.map((member) => (
                  <TableRow
                    key={member.id}
                    className="group hover:bg-zinc-50/50 transition-colors border-zinc-100"
                  >
                    {/* Sel Nama */}
                    <TableCell className="sticky left-0 z-20 bg-white group-hover:bg-zinc-50/95 py-3 border-r border-zinc-200/50 shadow-[2px_0_10px_rgb(0,0,0,0.02)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-zinc-900 text-sm truncate max-w-[150px]">
                          {member.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Sel 12 Bulan */}
                    {member.months.map((m: any) => {
                      const cellKey = `${member.id}-${m.month}`;
                      const isProcessing = processingCell === cellKey;

                      return (
                        <TableCell key={m.month} className="p-2 text-center">
                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleToggle(member.id, m.month, m.isPaid)
                            }
                            className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all duration-300 ${
                              isProcessing
                                ? "bg-zinc-100 text-zinc-400"
                                : m.isPaid
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-rose-500 hover:shadow-rose-500/20 group/btn"
                                  : "bg-zinc-100/80 text-zinc-300 hover:bg-primary/10 hover:text-primary hover:scale-110"
                            }`}
                            title={
                              m.isPaid
                                ? "Klik untuk batalin"
                                : "Klik buat lunas (30k)"
                            }
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : m.isPaid ? (
                              <>
                                {/* Default check, pas dihover jadi icon silang (batal) */}
                                <Check className="w-5 h-5 block group-hover/btn:hidden" />
                                <span className="text-[10px] font-bold hidden group-hover/btn:block">
                                  Batal
                                </span>
                              </>
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
