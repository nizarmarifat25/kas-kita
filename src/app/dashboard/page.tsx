// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { getDashboardMetrics } from "@/actions/dashboard"; // <-- Import fungsi baru
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
  Inbox,
} from "lucide-react";

// ... (Komponen Sparkline tetep biarin ada di sini) ...
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

  // Nangkep data asli dari database
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Greeting Section */}
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Saldo Card */}
        <Card className="group relative overflow-hidden border-zinc-200/60 bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Sparkline
            color="#3b82f6"
            points="0,40 20,35 40,45 60,20 80,25 100,5"
          />
          <CardHeader className="flex flex-row items-center justify-between pb-1 relative z-10 px-4 pt-4">
            <CardTitle className="text-xs font-semibold text-zinc-500">
              Total Saldo Kas
            </CardTitle>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-4 pb-4">
            <div className="text-xl font-bold text-zinc-900 tracking-tight">
              {metrics.saldo}
            </div>
          </CardContent>
        </Card>

        {/* Pemasukan Card */}
        <Card className="group relative overflow-hidden border-zinc-200/60 bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-500/40 p-1">
          <Sparkline
            color="#10b981"
            points="0,45 20,40 40,20 60,30 80,10 100,5"
          />
          <CardHeader className="flex flex-row items-center justify-between pb-1 relative z-10 px-4 pt-4">
            <CardTitle className="text-xs font-semibold text-zinc-500">
              Pemasukan Bulan Ini
            </CardTitle>
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-4 pb-4">
            <div className="text-xl font-bold text-zinc-900 tracking-tight">
              {metrics.pemasukanBulanIni}
            </div>
          </CardContent>
        </Card>

        {/* Pengeluaran Card */}
        <Card className="group relative overflow-hidden border-zinc-200/60 bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-rose-500/40 p-1">
          <Sparkline
            color="#f43f5e"
            points="0,10 20,15 40,5 60,35 80,25 100,45"
          />
          <CardHeader className="flex flex-row items-center justify-between pb-1 relative z-10 px-4 pt-4">
            <CardTitle className="text-xs font-semibold text-zinc-500">
              Pengeluaran Bulan Ini
            </CardTitle>
            <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-4 pb-4">
            <div className="text-xl font-bold text-zinc-900 tracking-tight">
              {metrics.pengeluaranBulanIni}
            </div>
          </CardContent>
        </Card>

        {/* Anggota Card */}
        <Card className="group relative overflow-hidden border-zinc-200/60 bg-white rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-purple-500/40 p-1">
          <CardHeader className="flex flex-row items-center justify-between pb-1 relative z-10 px-4 pt-4">
            <CardTitle className="text-xs font-semibold text-zinc-500">
              Anggota Aktif
            </CardTitle>
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 px-4 pb-4">
            <div className="text-xl font-bold text-zinc-900 tracking-tight">
              {metrics.anggotaAktif}{" "}
              <span className="text-sm font-medium text-zinc-400">user</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List Transaksi (Biar rapi kalo datanya kosong) */}
      <div className="bg-white border border-zinc-200/60 shadow-sm rounded-2xl p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
            Aktivitas Terakhir
          </h2>
        </div>

        <div className="space-y-2">
          {metrics.recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
              <Inbox className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm">Belum ada transaksi bulan ini.</p>
            </div>
          ) : (
            metrics.recentTransactions.map((trx) => (
              <div
                key={trx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 border border-transparent"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
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
                    <p className="text-sm font-semibold text-zinc-900">
                      {trx.description}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(trx.date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-sm font-bold ${trx.type === "income" ? "text-emerald-600" : "text-zinc-900"}`}
                >
                  {trx.type === "income" ? "+" : "-"} Rp{" "}
                  {trx.amount.toLocaleString("id-ID")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
