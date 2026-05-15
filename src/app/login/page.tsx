// src/app/login/page.tsx
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/actions/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Wallet, LogIn, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tombol Login
function LoginButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      className="w-full h-12 mt-4 rounded-xl text-base font-bold shadow-md transition-all hover:bg-primary/90 flex items-center justify-center gap-2" 
      type="submit" 
      disabled={pending}
    >
      {pending ? (
        <span className="animate-pulse">Memuat...</span>
      ) : (
        <>Masuk <LogIn className="w-5 h-5" /></>
      )}
    </Button>
  );
}

// Komponen Animasi Transaksi di Kanan
const FloatingTransactions = () => {
  return (
    <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
      {/* Cahaya di background kanan */}
      <div className="absolute w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-pulse" />
      
      {/* Card 1: Pemasukan Iuran (Posisi Kiri Atas) */}
      <div className="absolute -top-10 -left-10 w-72 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-float-1 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2.5 rounded-xl">
              <ArrowDownLeft className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Iuran Bulanan</p>
              <p className="text-zinc-400 text-xs">Asep</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-emerald-400 font-bold text-sm">+ Rp 50.000</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-500 inline ml-1" />
          </div>
        </div>
      </div>

      {/* Card 2: Pengeluaran (Posisi Kanan Tengah) */}
      <div className="absolute top-1/3 -right-16 w-72 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-float-2 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-rose-500/20 p-2.5 rounded-xl">
              <ArrowUpRight className="text-rose-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Operasional</p>
              <p className="text-zinc-400 text-xs">Abdul</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-rose-400 font-bold text-sm">- Rp 150.000</span>
          </div>
        </div>
      </div>

      {/* Card 3: Pemasukan Kas Khusus (Posisi Bawah Kiri) */}
      <div className="absolute -bottom-4 left-4 w-72 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-float-3 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2.5 rounded-xl">
              <ArrowDownLeft className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Kas Khusus</p>
              <p className="text-zinc-400 text-xs">Sambo</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-emerald-400 font-bold text-sm">+ Rp 200.000</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-500 inline ml-1" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <div className="min-h-screen w-full flex bg-white">
      
      {/* LEFT COLUMN - FORM SECTION (Putih Bersih) */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-8 sm:px-16 lg:px-20 relative z-10">
        <div className="max-w-sm w-full mx-auto space-y-8">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-6 shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Masuk ke Kas Kita
            </h1>
            <p className="text-zinc-500 text-sm">
              Sistem pencatatan kas transparan dan real-time.
            </p>
          </div>

          {/* Form */}
          <form action={dispatch} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-zinc-700">
                Email
              </Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="admin@kaskita.com" 
                required 
                className="h-12 px-4 rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-base"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-zinc-700">
                Password
              </Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="h-12 px-4 rounded-xl border-zinc-200 bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-base"
              />
            </div>
            
            <LoginButton />
          </form>

        </div>
      </div>

      {/* RIGHT COLUMN - ANIMATION SECTION (Gelap & Elegan) */}
      <div className="hidden lg:flex flex-1 bg-zinc-950 relative items-center justify-center overflow-hidden border-l border-zinc-800">
        {/* Pattern Background Tipis */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        {/* Render Animasi Card Transaksi */}
        <FloatingTransactions />
      </div>

    </div>
  );
}