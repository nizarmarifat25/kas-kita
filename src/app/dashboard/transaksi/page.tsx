// src/app/dashboard/transaksi/page.tsx
"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import {
  fetchTransactions,
  addTransaction,
  deleteTransaction,
} from "@/actions/transaksi";
import { fetchCategories } from "@/actions/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  ArrowRightLeft,
  ArrowDownRight,
  ArrowUpRight,
  Inbox,
  Loader2,
  Lock,
  FilterX,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full mt-6 h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md transition-all"
    >
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        "Catat Transaksi"
      )}
    </Button>
  );
}

export default function TransaksiPage() {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const [addState, addAction] = useActionState(addTransaction, undefined);

  // --- STATE UNTUK RANGE PICKER & PAGINATION ---
  const [date, setDate] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [trxRes, catRes] = await Promise.all([
        fetchTransactions(),
        fetchCategories(),
      ]);
      setData(trxRes);
      setCategories(catRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (addState?.error) toast.error(addState.error);
    else if (addState?.success) {
      toast.success(addState.message);
      setIsAddOpen(false);
      loadData();
    }
  }, [addState]);

  const confirmDelete = () => {
    if (!deletingItem) return;
    startDeleteTransition(async () => {
      const res = await deleteTransaction(deletingItem.id);
      if (res.success) {
        toast.success(res.message);
        loadData();
      } else toast.error(res.error);
      setDeletingItem(null);
    });
  };

  // --- LOGIC FILTERING TANGGAL (Pake DateRange) ---
  const filteredData = data.filter((item) => {
    if (!date?.from && !date?.to) return true;

    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);

    let isValid = true;
    if (date?.from) {
      const start = new Date(date.from);
      start.setHours(0, 0, 0, 0);
      if (itemDate < start) isValid = false;
    }
    if (date?.to) {
      const end = new Date(date.to);
      end.setHours(23, 59, 59, 999);
      if (itemDate > end) isValid = false;
    }
    return isValid;
  });

  // Reset ke halaman 1 tiap kali ganti filter
  useEffect(() => {
    setCurrentPage(1);
  }, [date]);

  // --- LOGIC PAGINATION ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <ArrowRightLeft className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">
              Keuangan
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Buku Kas
          </h1>
          <p className="text-zinc-500 mt-2 text-base">
            Catat semua pemasukan dan pengeluaran manual di sini.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="h-11 px-5 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-1 flex items-center gap-2 font-bold"
        >
          <Plus className="w-5 h-5" /> Catat Manual
        </Button>
      </div>

      {/* FILTER TOOLBAR DENGAN RANGE PICKER */}
      <div className="flex flex-col sm:flex-row items-center justify-start gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-zinc-500 font-semibold text-sm">
          <CalendarIcon className="w-4 h-4" /> Filter Tanggal:
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-10 justify-start text-left font-semibold w-[280px] rounded-lg border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors ${
                  !date && "text-zinc-400 font-medium"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd MMM yyyy")} -{" "}
                      {format(date.to, "dd MMM yyyy")}
                    </>
                  ) : (
                    format(date.from, "dd MMM yyyy")
                  )
                ) : (
                  <span>Pilih rentang tanggal...</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 rounded-2xl shadow-xl border-zinc-100"
              align="start"
            >
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                className="p-3"
              />
            </PopoverContent>
          </Popover>

          {date && (
            <Button
              variant="ghost"
              onClick={() => setDate(undefined)}
              className="h-10 px-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg flex items-center gap-2 font-bold transition-colors"
            >
              <FilterX className="w-4 h-4" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-200">
              <TableHead className="w-[120px] text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4 pl-6">
                Tanggal
              </TableHead>
              <TableHead className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">
                Deskripsi
              </TableHead>
              <TableHead className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">
                Kategori
              </TableHead>
              <TableHead className="text-right text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">
                Nominal
              </TableHead>
              <TableHead className="text-right text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4 pr-6">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="border-zinc-100">
                  <TableCell className="py-4 pl-6">
                    <div className="h-4 bg-zinc-100 rounded animate-pulse w-20" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-5 bg-zinc-100 rounded animate-pulse w-48" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-5 bg-zinc-100 rounded-full animate-pulse w-24" />
                  </TableCell>
                  <TableCell className="py-4 flex justify-end">
                    <div className="h-5 bg-zinc-100 rounded animate-pulse w-24" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-end">
                      <div className="h-8 w-8 bg-zinc-100 rounded-xl animate-pulse" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow className="border-0">
                <TableCell colSpan={5} className="h-[300px]">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100 shadow-sm">
                      <Inbox className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900">
                      Data Tidak Ditemukan
                    </h3>
                    <p className="text-zinc-500 mt-2">
                      Belum ada transaksi di rentang tanggal ini.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => {
                const isIuranSistem = item.description.startsWith("Iuran Bln");

                return (
                  <TableRow
                    key={item.id}
                    className="group hover:bg-zinc-50/50 transition-colors border-zinc-100"
                  >
                    <TableCell
                      className="py-4 pl-6 text-sm text-zinc-500 font-medium"
                      suppressHydrationWarning
                    >
                      {new Date(item.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="font-bold text-zinc-900 text-base flex items-center gap-2">
                        {item.description}
                      </p>
                    </TableCell>
                    
                    {/* LOGIC KATEGORI BARU */}
                    <TableCell className="py-4">
                      <span 
                        className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                          isIuranSistem 
                            ? 'bg-primary/10 text-primary border-primary/20' 
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200/50'
                        }`}
                      >
                        {isIuranSistem ? 'Iuran Bulanan' : (item.categoryName || "Tanpa Kategori")}
                      </span>
                    </TableCell>

                    <TableCell className="py-4 text-right">
                      <div
                        className={`inline-flex items-center gap-1.5 font-bold text-base ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        {item.type === "income" ? (
                          <ArrowDownRight className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                        Rp {item.amount.toLocaleString("id-ID")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      {isIuranSistem ? (
                        <div className="flex justify-end">
                          <span
                            className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded border border-zinc-200/60 uppercase tracking-widest cursor-not-allowed"
                            title="Dikelola dari menu Iuran Bulanan"
                          >
                            <Lock className="w-3 h-3" /> Auto
                          </span>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingItem(item)}
                          className="h-8 w-8 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION CONTROLS */}
      {!isLoading && filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 px-2">
          <p className="text-sm text-zinc-500 font-medium">
            Menampilkan{" "}
            <span className="font-bold text-zinc-900">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-bold text-zinc-900">
              {Math.min(currentPage * itemsPerPage, filteredData.length)}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-zinc-900">
              {filteredData.length}
            </span>{" "}
            transaksi
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-9 rounded-lg border-zinc-200 font-semibold"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <div className="px-4 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-sm font-bold text-zinc-700">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-9 rounded-lg border-zinc-200 font-semibold"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal Tambah Transaksi */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[24px] p-8 border-0 shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-extrabold text-zinc-900">
              Catat Transaksi
            </DialogTitle>
          </DialogHeader>
          <form action={addAction} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-800">
                Tipe Transaksi
              </Label>
              <Select name="type" required defaultValue="expense">
                <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income" className="font-medium">
                    Pemasukan (+)
                  </SelectItem>
                  <SelectItem
                    value="expense"
                    className="font-medium text-rose-600"
                  >
                    Pengeluaran (-)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-800">
                Nominal (Rp)
              </Label>
              <Input
                name="amount"
                type="number"
                required
                placeholder="30000"
                className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-800">
                Deskripsi / Keterangan
              </Label>
              <Input
                name="description"
                required
                placeholder="Beli galon, Fotocopy..."
                className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-800">
                Kategori
              </Label>
              <Select name="categoryId">
                <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4">
                  <SelectValue placeholder="Pilih Kategori (Opsional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SubmitButton />
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Hapus */}
      <AlertDialog
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
      >
        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl max-w-md p-8">
          <AlertDialogHeader>
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <AlertDialogTitle className="text-2xl font-extrabold text-zinc-900">
              Hapus Transaksi?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-zinc-500 mt-2">
              Transaksi{" "}
              <strong className="text-zinc-900">
                "{deletingItem?.description}"
              </strong>{" "}
              bakal dihapus. Ini akan ngubah total Saldo lu. Yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="h-12 rounded-xl font-bold border-zinc-200 hover:bg-zinc-50 mt-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="h-12 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white border-0"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Hapus Transaksi"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}