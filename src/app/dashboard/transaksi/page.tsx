// src/app/dashboard/transaksi/page.tsx
'use client';

import { useState, useEffect, useActionState, useTransition } from 'react';
import { fetchTransactions, addTransaction, deleteTransaction } from '@/actions/transaksi';
import { fetchCategories } from '@/actions/category'; // Ambil data kategori buat dropdown form
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowRightLeft, ArrowDownRight, ArrowUpRight, Inbox, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-6 h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-md transition-all">
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Catat Transaksi'}
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [trxRes, catRes] = await Promise.all([fetchTransactions(), fetchCategories()]);
      setData(trxRes);
      setCategories(catRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <ArrowRightLeft className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">Keuangan</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Buku Kas</h1>
          <p className="text-zinc-500 mt-2 text-base">Catat semua pemasukan dan pengeluaran manual di sini.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="h-11 px-5 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-1 flex items-center gap-2 font-bold">
          <Plus className="w-5 h-5" /> Catat Manual
        </Button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-200">
              <TableHead className="w-[120px] text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4 pl-6">Tanggal</TableHead>
              <TableHead className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">Deskripsi</TableHead>
              <TableHead className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">Kategori</TableHead>
              <TableHead className="text-right text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">Nominal</TableHead>
              <TableHead className="text-right text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4 pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="border-zinc-100">
                  <TableCell className="py-4 pl-6"><div className="h-4 bg-zinc-100 rounded animate-pulse w-20" /></TableCell>
                  <TableCell className="py-4"><div className="h-5 bg-zinc-100 rounded animate-pulse w-48" /></TableCell>
                  <TableCell className="py-4"><div className="h-5 bg-zinc-100 rounded-full animate-pulse w-24" /></TableCell>
                  <TableCell className="py-4 flex justify-end"><div className="h-5 bg-zinc-100 rounded animate-pulse w-24" /></TableCell>
                  <TableCell className="py-4"><div className="flex justify-end"><div className="h-8 w-8 bg-zinc-100 rounded-xl animate-pulse" /></div></TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="border-0">
                <TableCell colSpan={5} className="h-[300px]">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100 shadow-sm">
                      <Inbox className="w-8 h-8 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900">Buku Kas Kosong</h3>
                    <p className="text-zinc-500 mt-2">Belum ada catatan keluar masuk uang nih.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="group hover:bg-zinc-50/50 transition-colors border-zinc-100">
                  <TableCell className="py-4 pl-6 text-sm text-zinc-500 font-medium">
                    {new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="py-4">
                    <p className="font-bold text-zinc-900 text-base">{item.description}</p>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200/50">
                      {item.categoryName || 'Tanpa Kategori'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 font-bold text-base ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      Rp {item.amount.toLocaleString('id-ID')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <Button variant="ghost" size="icon" onClick={() => setDeletingItem(item)} className="h-8 w-8 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Tambah Transaksi */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[24px] p-8 border-0 shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-extrabold text-zinc-900">Catat Transaksi</DialogTitle>
          </DialogHeader>
          <form action={addAction} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-800">Tipe Transaksi</Label>
              <Select name="type" required defaultValue="expense">
                <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income" className="font-medium">Pemasukan (+)</SelectItem>
                  <SelectItem value="expense" className="font-medium text-rose-600">Pengeluaran (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-800">Nominal (Rp)</Label>
              <Input name="amount" type="number" required placeholder="30000" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4 font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-800">Deskripsi / Keterangan</Label>
              <Input name="description" required placeholder="Beli galon, Fotocopy..." className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-800">Kategori</Label>
              <Select name="categoryId">
                <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4">
                  <SelectValue placeholder="Pilih Kategori (Opsional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SubmitButton />
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Hapus */}
      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl max-w-md p-8">
          <AlertDialogHeader>
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4"><Trash2 className="w-7 h-7" /></div>
            <AlertDialogTitle className="text-2xl font-extrabold text-zinc-900">Hapus Transaksi?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-zinc-500 mt-2">
              Transaksi <strong className="text-zinc-900">"{deletingItem?.description}"</strong> bakal dihapus. Ini akan ngubah total Saldo lu. Yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="h-12 rounded-xl font-bold border-zinc-200 hover:bg-zinc-50 mt-0">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmDelete(); }} className="h-12 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white border-0">
              {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Hapus Transaksi'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}