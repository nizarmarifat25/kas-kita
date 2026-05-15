// src/app/dashboard/kategori/page.tsx
"use client";

import { useState, useEffect, useActionState, useTransition } from "react";
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  editCategory,
} from "@/actions/category";
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
  DialogDescription,
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
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  Inbox,
  Edit2,
  Loader2,
} from "lucide-react";
import { useFormStatus } from "react-dom";

// Tombol Loading untuk Form Tambah/Edit
function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full mt-6 h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md transition-all"
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : text}
    </Button>
  );
}

export default function KategoriPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // <-- State buat nahan loading

  // State untuk ngatur Modal (Dialog)
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  // Action States
  const [addState, addAction] = useActionState(addCategory, undefined);
  const [editState, editAction] = useActionState(editCategory, undefined);

  // Fetch Data
  const loadData = async () => {
    setIsLoading(true); // Mulai loading
    try {
      const res = await fetchCategories();
      setData(res);
    } finally {
      setIsLoading(false); // Kelar loading
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Monitor efek Tambah Data
  useEffect(() => {
    if (addState?.error) toast.error(addState.error);
    else if (addState?.success) {
      toast.success(addState.message);
      setIsAddOpen(false);
      loadData();
    }
  }, [addState]);

  // Monitor efek Edit Data
  useEffect(() => {
    if (editState?.error) toast.error(editState.error);
    else if (editState?.success) {
      toast.success(editState.message);
      setEditingItem(null);
      loadData();
    }
  }, [editState]);

  // Fungsi Hapus Data
  const confirmDelete = () => {
    if (!deletingItem) return;
    startDeleteTransition(async () => {
      const res = await deleteCategory(deletingItem.id);
      if (res.success) {
        toast.success(res.message);
        loadData();
      } else {
        toast.error(res.error);
      }
      setDeletingItem(null);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-10">
      {/* Header Premium - Minimalist */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Tag className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">
              Master Data
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Kategori Kas
          </h1>
          <p className="text-zinc-500 mt-2 text-base">
            Kelola label pembukuan biar laporan keuangan rapi dan gampang
            dibaca.
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="h-11 px-5 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-1 flex items-center gap-2 font-bold"
        >
          <Plus className="w-5 h-5" /> Kategori Baru
        </Button>
      </div>

      {/* Tabel Data (Super Clean) */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-200">
              <TableHead className="w-[100px] text-center text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">
                ID
              </TableHead>
              <TableHead className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">
                Nama Kategori
              </TableHead>
              <TableHead className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">
                Tipe Transaksi
              </TableHead>
              <TableHead className="text-right text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4 pr-8">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // 1. Tampilan Skeleton Loading
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={idx} className="hover:bg-transparent border-zinc-100">
                  <TableCell className="py-4">
                    <div className="h-4 bg-zinc-100 rounded animate-pulse w-6 mx-auto"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-5 bg-zinc-100 rounded animate-pulse w-32"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-6 bg-zinc-100 rounded-full animate-pulse w-24"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-end gap-2 pr-6">
                      <div className="h-9 w-9 bg-zinc-100 rounded-xl animate-pulse"></div>
                      <div className="h-9 w-9 bg-zinc-100 rounded-xl animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // 2. Tampilan Empty State
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={4} className="h-[350px]">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-5 border border-zinc-100 shadow-sm">
                      <Inbox className="w-10 h-10 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                      Kategori Kosong
                    </h3>
                    <p className="text-base text-zinc-500 mt-2 max-w-sm mx-auto">
                      Belum ada data kategori nih bre. Bikin kategori pertama lu
                      buat mulai nyatet keuangan.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddOpen(true)}
                      className="mt-6 rounded-xl border-zinc-200 hover:bg-zinc-50 font-semibold"
                    >
                      Tambah Data Sekarang
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // 3. Tampilan Data Asli
              data.map((item) => (
                <TableRow
                  key={item.id}
                  className="group hover:bg-zinc-50/50 transition-colors border-zinc-100"
                >
                  <TableCell className="text-center font-semibold text-zinc-400 py-4">
                    {item.id}
                  </TableCell>
                  <TableCell className="font-bold text-zinc-900 text-base py-4">
                    {item.name}
                  </TableCell>
                  <TableCell className="py-4">
                    {item.type === "income" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/50">
                        <ArrowDownRight className="w-4 h-4" /> Pemasukan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/50">
                        <ArrowUpRight className="w-4 h-4" /> Pengeluaran
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingItem(item)}
                        className="h-9 w-9 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingItem(item)}
                        className="h-9 w-9 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ================= MODAL TAMBAH DATA ================= */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[24px] p-8 border-0 shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-extrabold text-zinc-900">
              Tambah Kategori
            </DialogTitle>
          </DialogHeader>
          <form action={addAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-zinc-800">
                Nama Kategori
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Misal: Iuran Bulanan"
                required
                className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-bold text-zinc-800">
                Tipe Transaksi
              </Label>
              <Select name="type" required defaultValue="income">
                <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg border-zinc-100">
                  <SelectItem
                    value="income"
                    className="font-medium cursor-pointer py-2.5"
                  >
                    Pemasukan (Income)
                  </SelectItem>
                  <SelectItem
                    value="expense"
                    className="font-medium cursor-pointer py-2.5"
                  >
                    Pengeluaran (Expense)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SubmitButton text="Simpan Kategori Baru" />
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL EDIT DATA ================= */}
      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <DialogContent className="sm:max-w-[400px] rounded-[24px] p-8 border-0 shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-extrabold text-zinc-900">
              Edit Kategori
            </DialogTitle>
          </DialogHeader>
          <form action={editAction} className="space-y-5">
            {/* Input Hidden buat ngirim ID ke Server Action */}
            <input type="hidden" name="id" value={editingItem?.id || ""} />

            <div className="space-y-2">
              <Label
                htmlFor="edit-name"
                className="text-sm font-bold text-zinc-800"
              >
                Nama Kategori
              </Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={editingItem?.name}
                required
                className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-type"
                className="text-sm font-bold text-zinc-800"
              >
                Tipe Transaksi
              </Label>
              <Select name="type" required defaultValue={editingItem?.type}>
                <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg border-zinc-100">
                  <SelectItem
                    value="income"
                    className="font-medium cursor-pointer py-2.5"
                  >
                    Pemasukan (Income)
                  </SelectItem>
                  <SelectItem
                    value="expense"
                    className="font-medium cursor-pointer py-2.5"
                  >
                    Pengeluaran (Expense)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SubmitButton text="Update Kategori"  />
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= ALERT DIALOG HAPUS DATA ================= */}
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
              Hapus Kategori?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-zinc-500 mt-2">
              Kategori{" "}
              <strong className="text-zinc-900">"{deletingItem?.name}"</strong>{" "}
              bakal dihapus permanen. yakin mau ngelanjutin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="h-12 mr-2 font-bold border-zinc-200 hover:bg-zinc-50 mt-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Mencegah modal langsung ketutup sebelum proses kelar
                confirmDelete();
              }}
              className="h-12  font-bold bg-rose-600 hover:bg-rose-700 text-white border-0"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Ya, Hapus Permanen"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}