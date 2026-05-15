// src/app/dashboard/anggota/page.tsx
'use client';

import { useState, useEffect, useActionState, useTransition } from 'react';
import { fetchMembers, addMember, deleteMember, editMember } from '@/actions/member';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Users, Edit2, Loader2, UserMinus, Phone } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-6 h-11 rounded-xl font-bold  bg-primary hover:bg-primary/90  text-white shadow-md transition-all">
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : text}
    </Button>
  );
}

export default function AnggotaPage() {
  const [data, setData] = useState<any[]>([]);
  // Tambahan state buat nahan loading
  const [isLoading, setIsLoading] = useState(true); 
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const [addState, addAction] = useActionState(addMember, undefined);
  const [editState, editAction] = useActionState(editMember, undefined);

  // Update fungsi load biar ngatur state loading
  const loadData = async () => {
    setIsLoading(true); // Mulai loading
    try {
      const res = await fetchMembers();
      setData(res);
    } finally {
      setIsLoading(false); // Selesai loading
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

  useEffect(() => {
    if (editState?.error) toast.error(editState.error);
    else if (editState?.success) {
      toast.success(editState.message);
      setEditingItem(null);
      loadData();
    }
  }, [editState]);

  const confirmDelete = () => {
    if (!deletingItem) return;
    startDeleteTransition(async () => {
      const res = await deleteMember(deletingItem.id);
      if (res.success) {
        toast.success(res.message);
        loadData();
      } else toast.error(res.error);
      setDeletingItem(null);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Users className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">Direktori</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Data Anggota</h1>
          <p className="text-zinc-500 mt-2 text-base">Kelola daftar anggota yang terdaftar dalam sistem kas kita.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="h-11 px-5 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-1 flex items-center gap-2 font-bold">
          <Plus className="w-5 h-5" /> Tambah Anggota
        </Button>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow className="hover:bg-transparent border-zinc-200">
              <TableHead className="w-[80px] text-center text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">No</TableHead>
              <TableHead className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">Profil Anggota</TableHead>
              <TableHead className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">Kontak</TableHead>
              <TableHead className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4">Status</TableHead>
              <TableHead className="text-right text-xs font-extrabold text-zinc-500 uppercase tracking-widest py-4 pr-8">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Logic Render Data */}
            {isLoading ? (
              // 1. Tampilan Skeleton Loading
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={idx} className="hover:bg-transparent">
                  <TableCell className="py-4">
                    <div className="h-4 bg-zinc-100 rounded animate-pulse w-6 mx-auto"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 animate-pulse shrink-0"></div>
                      <div className="h-5 bg-zinc-100 rounded animate-pulse w-32"></div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 bg-zinc-100 rounded animate-pulse w-24"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-6 bg-zinc-100 rounded-full animate-pulse w-16"></div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex justify-end gap-2 pr-4">
                      <div className="h-9 w-9 bg-zinc-100 rounded-xl animate-pulse"></div>
                      <div className="h-9 w-9 bg-zinc-100 rounded-xl animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // 2. Tampilan Empty State
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={5} className="h-[350px]">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-5 border border-zinc-100 shadow-sm">
                      <UserMinus className="w-10 h-10 text-zinc-300" />
                    </div>
                    <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">Belum Ada Anggota</h3>
                    <p className="text-base text-zinc-500 mt-2 max-w-sm mx-auto">Sistem kas butuh anggota buat tracking iuran. Tambah data anggota pertama sekarang.</p>
                    <Button variant="outline" onClick={() => setIsAddOpen(true)} className="mt-6 rounded-xl border-zinc-200 hover:bg-zinc-50 font-semibold">
                      Tambah Anggota
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // 3. Tampilan Data Asli
              data.map((item, index) => (
                <TableRow key={item.id} className="group hover:bg-zinc-50/50 transition-colors border-zinc-100">
                  <TableCell className="text-center font-semibold text-zinc-400 py-4">{index + 1}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-zinc-900 text-base">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {item.phone ? (
                      <div className="flex items-center gap-2 text-zinc-600 font-medium">
                        <Phone className="w-4 h-4 text-zinc-400" /> {item.phone}
                      </div>
                    ) : (
                      <span className="text-zinc-400 italic text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    {item.status === 'active' ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/50">Aktif</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold border border-zinc-200/80">Non-Aktif</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)} className="h-9 w-9 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingItem(item)} className="h-9 w-9 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ... (Modal Tambah/Edit dan Alert Dialog Hapus tetep sama persis kaya sebelumnya) ... */}
      {[
        { isOpen: isAddOpen, setIsOpen: setIsAddOpen, action: addAction, title: "Tambah Anggota", item: null },
        { isOpen: !!editingItem, setIsOpen: (val: boolean) => !val && setEditingItem(null), action: editAction, title: "Edit Anggota", item: editingItem }
      ].map((modal, i) => (
        <Dialog key={i} open={modal.isOpen} onOpenChange={modal.setIsOpen}>
          <DialogContent className="sm:max-w-[400px] rounded-[24px] p-8 border-0 shadow-2xl">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-extrabold text-zinc-900">{modal.title}</DialogTitle>
            </DialogHeader>
            <form action={modal.action} className="space-y-5">
              {modal.item && <input type="hidden" name="id" value={modal.item.id} />}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-zinc-800">Nama Lengkap</Label>
                <Input name="name" defaultValue={modal.item?.name} required placeholder="Misal: Fathan" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-zinc-800">No. WhatsApp / HP</Label>
                <Input name="phone" defaultValue={modal.item?.phone} placeholder="0812xxxx (Opsional)" className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-zinc-800">Status Anggota</Label>
                <Select name="status" required defaultValue={modal.item?.status || "active"}>
                  <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white text-base px-4">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-lg border-zinc-100">
                    <SelectItem value="active" className="cursor-pointer py-2.5">Aktif</SelectItem>
                    <SelectItem value="inactive" className="cursor-pointer py-2.5">Non-Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <SubmitButton text="Simpan Data" />
            </form>
          </DialogContent>
        </Dialog>
      ))}

      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent className="rounded-3xl border-0 shadow-2xl max-w-md p-8">
          <AlertDialogHeader>
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4"><Trash2 className="w-7 h-7" /></div>
            <AlertDialogTitle className="text-2xl font-extrabold text-zinc-900">Hapus Anggota?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-zinc-500 mt-2">
              Anggota <strong className="text-zinc-900">"{deletingItem?.name}"</strong> bakal dihapus. Yakin mau ngelanjutin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="h-12 rounded-xl font-bold border-zinc-200 hover:bg-zinc-50 mt-0">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmDelete(); }} className="h-12 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white border-0">
              {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Hapus Permanen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}