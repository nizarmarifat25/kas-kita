// src/app/page.tsx
import Link from "next/link";
import { Wallet, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-zinc-900 selection:bg-primary/10 selection:text-primary">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-zinc-100">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20 transition-all group-hover:bg-primary group-hover:text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Kas Kita</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-bold text-zinc-600 hover:text-primary transition-colors">
                Masuk
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-5 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                Mulai Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-[-5%] w-[30%] h-[50%] bg-emerald-500/5 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Zap className="w-3 h-3 text-primary fill-primary" /> v1.0.0 is Live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-zinc-900 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Kelola Kas Tim <br /> <span className="text-primary">Makin Transparan.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000">
              Solusi cerdas buat nyatet iuran bulanan, pengeluaran operasional, dan pantau saldo tim secara real-time. Ga ada lagi tuh drama "duit kas lari ke mana".
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-14 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-lg font-bold shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  Buka Dashboard <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-2xl text-lg font-bold border-zinc-200 hover:bg-zinc-50 transition-all">
                  Lihat Dokumentasi
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 bg-zinc-50/50 border-y border-zinc-100">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-[32px] border border-zinc-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 group">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Matriks Iuran</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Tracking iuran bulanan anggota cuma modal sekali klik. Status lunas otomatis tercatat ke buku kas.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-[32px] border border-zinc-200/60 shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all duration-500 group">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Transparansi Total</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Semua anggota bisa lihat aliran dana masuk dan keluar. Ga ada lagi catatan manual yang gampang hilang.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-[32px] border border-zinc-200/60 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all duration-500 group">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Laporan Real-time</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Dapatkan ringkasan saldo, total pemasukan, dan pengeluaran per bulan secara instan di dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t border-zinc-100">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-zinc-400">
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-bold tracking-tight text-zinc-900 italic">Kas Kita</span>
            <span className="text-sm font-medium ml-2">© {new Date().getFullYear()} Nizar Verse. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-semibold text-zinc-400">
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}