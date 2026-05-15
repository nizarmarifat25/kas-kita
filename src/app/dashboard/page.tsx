// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

// Komponen Dummy untuk Grafik Garis Kecil (Sparkline) di dalam Widget
const Sparkline = ({ color, points }: { color: string; points: string }) => (
  <svg
    className="absolute bottom-4 right-4 w-16 h-8 opacity-30"
    viewBox="0 0 100 50"
    preserveAspectRatio="none"
  >
    <polyline
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      points={points}
    />
  </svg>
);

export default async function DashboardPage() {
  const session = await auth();

  // Data dummy yang dibikin lebih kompleks
  const dummyMetrics = {
    saldo: "Rp 4.500.000",
    saldoTrend: "+2.5%",
    pemasukan: "Rp 1.200.000",
    pemasukanTrend: "+15.0%",
    pengeluaran: "Rp 350.000",
    pengeluaranTrend: "-5.2%", // Turun pengeluaran berarti bagus
    anggotaAktif: 24,
    anggotaBaru: 2,
  };

  const dummyTransactions = [
    {
      id: 1,
      type: "income",
      desc: "Iuran Bulanan - Fathan",
      category: "Iuran",
      amount: "+ Rp 50.000",
      date: "Hari ini, 09:00",
    },
    {
      id: 2,
      type: "expense",
      desc: "Beli Galon & Kopi",
      category: "Operasional",
      amount: "- Rp 75.000",
      date: "Kemarin, 14:30",
    },
    {
      id: 3,
      type: "income",
      desc: "Iuran Bulanan - Kevin",
      category: "Iuran",
      amount: "+ Rp 50.000",
      date: "12 Mei 2026",
    },
    {
      id: 4,
      type: "income",
      desc: "Donasi Hamba Allah",
      category: "Sedekah",
      amount: "+ Rp 200.000",
      date: "10 Mei 2026",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Greeting Section - Font dikecilin */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Overview Kas
        </h1>
        <p className="text-zinc-500 mt-1 text-sm">
          Pantau ringkasan finansial dan aktivitas terbaru{" "}
          <span className="font-semibold text-zinc-700">
            {session?.user?.name}
          </span>
          .
        </p>
      </div>

      {/* Metrics Cards - Desain Kompleks & Compact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Saldo Card */}
        <Card className="group relative overflow-hidden border-zinc-200/60 bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 cursor-pointer p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Sparkline
            color="#3b82f6"
            points="0,40 20,35 40,45 60,20 80,25 100,5"
          />

          <CardHeader className="flex flex-row items-center justify-between pb-1 relative z-10 px-4 pt-4">
            <CardTitle className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">
              Total Saldo Kas
            </CardTitle>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-4 pb-4">
            <div className="text-xl font-bold text-zinc-900 tracking-tight">
              {dummyMetrics.saldo}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600 bg-emerald-50 w-max px-1.5 py-0.5 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> {dummyMetrics.saldoTrend}{" "}
              bulan ini
            </div>
          </CardContent>
        </Card>

        {/* Pemasukan Card */}
        <Card className="group relative overflow-hidden border-zinc-200/60 bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-500/40 cursor-pointer p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Sparkline
            color="#10b981"
            points="0,45 20,40 40,20 60,30 80,10 100,5"
          />

          <CardHeader className="flex flex-row items-center justify-between pb-1 relative z-10 px-4 pt-4">
            <CardTitle className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">
              Pemasukan Bulanan
            </CardTitle>
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-4 pb-4">
            <div className="text-xl font-bold text-zinc-900 tracking-tight">
              {dummyMetrics.pemasukan}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600 bg-emerald-50 w-max px-1.5 py-0.5 rounded-md">
              <ArrowUpRight className="w-3 h-3" /> {dummyMetrics.pemasukanTrend}{" "}
              vs lalu
            </div>
          </CardContent>
        </Card>

        {/* Pengeluaran Card */}
        <Card className="group relative overflow-hidden border-zinc-200/60 bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-rose-500/40 cursor-pointer p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Sparkline
            color="#f43f5e"
            points="0,10 20,15 40,5 60,35 80,25 100,45"
          />

          <CardHeader className="flex flex-row items-center justify-between pb-1 relative z-10 px-4 pt-4">
            <CardTitle className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">
              Pengeluaran Bulanan
            </CardTitle>
            <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-4 pb-4">
            <div className="text-xl font-bold text-zinc-900 tracking-tight">
              {dummyMetrics.pengeluaran}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600 bg-emerald-50 w-max px-1.5 py-0.5 rounded-md">
              {/* Pake ijo karena pengeluaran turun itu bagus */}
              <ArrowDownRight className="w-3 h-3" />{" "}
              {dummyMetrics.pengeluaranTrend} vs lalu
            </div>
          </CardContent>
        </Card>

        {/* Anggota Card */}
        <Card className="group relative overflow-hidden border-zinc-200/60 bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-purple-500/40 cursor-pointer p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-1 relative z-10 px-4 pt-4">
            <CardTitle className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">
              Anggota Terdaftar
            </CardTitle>
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-4 pb-4">
            <div className="text-xl font-bold text-zinc-900 tracking-tight">
              {dummyMetrics.anggotaAktif}{" "}
              <span className="text-sm font-medium text-zinc-400">user</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-zinc-500 bg-zinc-100 w-max px-1.5 py-0.5 rounded-md">
              <Activity className="w-3 h-3 text-purple-500" /> +
              {dummyMetrics.anggotaBaru} user baru
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Section - Compact Size */}
      <div className="bg-white border border-zinc-200/60 shadow-sm rounded-2xl p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
            Aktivitas Terakhir
          </h2>
          <button className="group flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
            Lihat Detail{" "}
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="space-y-2">
          {dummyTransactions.map((trx) => (
            <div
              key={trx.id}
              className="group flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 border border-transparent hover:border-zinc-200 hover:bg-white hover:shadow-md hover:shadow-zinc-200/50 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                    trx.type === "income"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  }`}
                >
                  {trx.type === "income" ? (
                    <ArrowDownRight className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 transition-colors group-hover:text-primary">
                    {trx.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 bg-zinc-200/50 px-1.5 rounded">
                      {trx.category}
                    </span>
                    <span className="text-xs text-zinc-500">{trx.date}</span>
                  </div>
                </div>
              </div>
              <div
                className={`text-sm font-bold transition-transform duration-300 group-hover:scale-105 ${
                  trx.type === "income" ? "text-emerald-600" : "text-zinc-900"
                }`}
              >
                {trx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
