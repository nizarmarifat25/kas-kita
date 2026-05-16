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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CalendarCheck, Check, Plus, Loader2, Search, UserMinus } from "lucide-react";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
];

export default function IuranPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. State buat Filter Nama
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Generate Tahun Otomatis (3 tahun ke belakang s/d 2 tahun ke depan)
  const dynamicYears = Array.from({ length: 6 }, (_, i) => currentYear - 3 + i);

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

  useEffect(() => {
    loadData(selectedYear);
  }, [selectedYear]);

  // 3. Fungsi Toggle dengan Validasi Sekuensial
  const handleToggle = (
    member: any,
    month: number,
    isCurrentlyPaid: boolean,
  ) => {
    const memberId = member.id;
    const monthIndex = month - 1;


    // Kalau lolos validasi, lanjut eksekusi:
    const cellKey = `${memberId}-${month}`;
    setProcessingCell(cellKey);

    startTransition(async () => {
      const res = await toggleIuran(
        memberId,
        month,
        selectedYear,
        isCurrentlyPaid,
      );
      if (res.success) {
        setData((prev) =>
          prev.map((mItem) => {
            if (mItem.id === memberId) {
              return {
                ...mItem,
                months: mItem.months.map((m: any) =>
                  m.month === month ? { ...m, isPaid: !isCurrentlyPaid } : m,
                ),
              };
            }
            return mItem;
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

  // Terapkan Filter Pencarian Nama
  const filteredData = data.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
      
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
            Klik kotak bulan secara berurutan buat nandain lunas.
          </p>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
        {/* Pencarian Nama */}
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Cari nama anggota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white transition-colors text-sm font-medium"
          />
        </div>

        {/* Dropdown Tahun */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-bold text-zinc-500 hidden sm:inline-block">Tahun:</span>
          <Select
            value={selectedYear.toString()}
            onValueChange={(val) => setSelectedYear(parseInt(val))}
          >
            <SelectTrigger className="w-full sm:w-[130px] h-11 rounded-xl bg-white border-zinc-200 focus:ring-primary/20 font-bold text-zinc-900 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg border-zinc-100">
              {dynamicYears.map((y) => (
                <SelectItem
                  key={y}
                  value={y.toString()}
                  className="font-semibold py-2.5 cursor-pointer"
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
                <TableHead className="sticky left-0 z-20 bg-zinc-50/95 backdrop-blur-sm w-[100px] min-w-[100px] text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4 border-r border-zinc-200/50 shadow-[2px_0_10px_rgb(0,0,0,0.02)]">
                  Nama Anggota
                </TableHead>
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
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={13}
                    className="h-[250px] text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100 shadow-sm">
                        <UserMinus className="w-8 h-8 text-zinc-300" />
                      </div>
                      <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">Tidak Ada Data</h3>
                      <p className="text-base text-zinc-500 mt-2 max-w-sm mx-auto">
                        Anggota yang lu cari ga ketemu bre, atau belum ada anggota sama sekali.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Gunakan filteredData
                filteredData.map((member) => (
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
                            // Kita panggil fungsi handleToggle sambil bawa objek member keseluruhan buat divalidasi
                            onClick={() => handleToggle(member, m.month, m.isPaid)}
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