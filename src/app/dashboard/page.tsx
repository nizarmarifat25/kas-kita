import { auth } from "@/auth";
import Link from "next/link";
import { getDashboardMetrics } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
  Plus,
  CalendarCheck,
  Zap,
  Activity,
  CreditCard,
  History,
  MoreHorizontal,
  Sparkles,
  BarChart3,
  ChevronRight,
} from "lucide-react";

const Noise = () => (
  <div
    className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[inherit]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px",
    }}
  />
);

const LiveDot = ({ color = "bg-emerald-400" }: { color?: string }) => (
  <span className="relative flex h-2.5 w-2.5">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-60`} />
    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
  </span>
);

const Sparkline = ({
  color,
  values,
  id,
  className = "",
}: {
  color: string;
  values: number[];
  id: string;
  className?: string;
}) => {
  const max = Math.max(...values, 1);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${50 - (v / max) * 45}`)
    .join(" ");

  return (
    <svg
      className={`absolute w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 100 50"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`sg-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M0,50 L${points.split(" ").join(" L")} L100,50 Z`} fill={`url(#sg-${id})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity="0.7"
      />
    </svg>
  );
};

const MiniBarChart = ({ values, color }: { values: number[]; color: string }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[3px] h-10">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${Math.max(8, (v / max) * 100)}%`,
            background: color,
            opacity: 0.35 + (i / (values.length - 1)) * 0.65,
          }}
        />
      ))}
    </div>
  );
};

const GrowthBadge = ({
  pct,
  positiveIsGood = true,
}: {
  pct: number | null;
  positiveIsGood?: boolean;
}) => {
  if (pct === null)
    return <span className="text-xs text-zinc-400 font-semibold">— Data bulan lalu belum ada</span>;

  const isPositive = pct >= 0;
  const isGood = positiveIsGood ? isPositive : !isPositive;
  const colorClass = isGood ? "text-emerald-500" : "text-rose-500";
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={`flex items-center gap-1 text-xs font-bold ${colorClass}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>
        {isPositive ? "+" : ""}
        {pct}% vs bulan lalu
      </span>
    </div>
  );
};

export default async function DashboardPage() {
  const session = await auth();
  const metrics = await getDashboardMetrics();

  const hour = new Date().getHours();
  let greeting = "Selamat Pagi";
  if (hour >= 11 && hour < 15) greeting = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat Sore";
  else if (hour >= 18 || hour < 3) greeting = "Selamat Malam";

  const firstName = session?.user?.name?.split(" ")[0] || "Admin";

  return (
    <div className="min-h-screen bg-[#f6f7fb] relative">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(ellipse,_#d1fae5_0%,_transparent_70%)] opacity-40" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(ellipse,_#ede9fe_0%,_transparent_70%)] opacity-30" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-10 py-8 pb-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tighter text-zinc-900 leading-none">
              {greeting},{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
                  {firstName}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-emerald-400/40 to-cyan-400/40 rounded-full" />
              </span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium mt-2">
              Pantau arus kas dan aktivitas keuangan organisasi kamu di sini.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Periode</p>
              <p className="text-sm font-extrabold text-zinc-700">
                {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="h-10 w-px bg-zinc-200 hidden sm:block" />
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-zinc-200 shadow-sm text-xs font-bold text-zinc-600 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-500" />
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric" })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="md:col-span-2 relative group overflow-hidden rounded-[28px] bg-zinc-900 shadow-xl ring-1 ring-inset ring-white/[0.07] transition-all duration-500 hover:ring-white/[0.12]">
            <Noise />
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-1000" />
            <Sparkline color="#34d399" values={metrics.barIncome} id="saldo" className="bottom-0 left-0 opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-700" />

            <div className="relative z-10 p-8 flex flex-col justify-between min-h-[230px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center border border-white/[0.05]">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Kas Utama</span>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-2">Total Saldo Tersedia</p>
                <h2 className="text-4xl sm:text-5xl xl:text-[3.5rem] font-black tracking-tighter text-white leading-none">
                  {metrics.saldo}
                </h2>

                <div className="flex items-center gap-4 mt-6 pt-5 border-t border-white/[0.06]">
                  <GrowthBadge pct={metrics.incomeGrowth} />
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-zinc-500 text-xs font-medium" suppressHydrationWarning>
                    {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-[28px] bg-white ring-1 ring-inset ring-zinc-200/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between min-h-[230px] p-6">
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60 rounded-b-full" />
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Pemasukan</p>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <MiniBarChart values={metrics.barIncome} color="#10b981" />
            </div>
            <div className="mt-4">
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
              </p>
              <h3 className="text-2xl sm:text-[1.75rem] font-black tracking-tighter text-zinc-900 leading-none mb-3">
                {metrics.pemasukanBulanIni}
              </h3>
              <GrowthBadge pct={metrics.incomeGrowth} positiveIsGood={true} />
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-[28px] bg-white ring-1 ring-inset ring-zinc-200/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between min-h-[230px] p-6">
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-rose-400 to-transparent opacity-60 rounded-b-full" />
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Pengeluaran</p>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <MiniBarChart values={metrics.barExpense} color="#f43f5e" />
            </div>
            <div className="mt-4">
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
              </p>
              <h3 className="text-2xl sm:text-[1.75rem] font-black tracking-tighter text-zinc-900 leading-none mb-3">
                {metrics.pengeluaranBulanIni}
              </h3>
              <GrowthBadge pct={metrics.expenseGrowth} positiveIsGood={false} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              label: "Transaksi Hari Ini",
              value: String(metrics.todayTransactionCount),
              unit: "transaksi",
              icon: <Activity className="w-4 h-4" />,
              progress: Math.min(100, (metrics.todayTransactionCount / 10) * 100),
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative group overflow-hidden rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-inset ring-zinc-200/80 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-500 flex items-center justify-center group-hover:bg-zinc-100 transition-colors duration-300">
                  {stat.icon}
                </div>
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-md">
                  {i === 1 ? "Hari Ini" : i === 2 ? "Bulan Ini" : i === 3 ? "Pending" : "Aktif"}
                </span>
              </div>

              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-3xl font-black tracking-tighter text-zinc-900">{stat.value}</span>
                <span className="text-xs font-semibold text-zinc-400">{stat.unit}</span>
              </div>

              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-800 rounded-full transition-all duration-1000"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 bg-white rounded-[28px] shadow-sm ring-1 ring-inset ring-zinc-200/80 overflow-hidden flex flex-col">
            <div className="px-6 sm:px-8 py-5 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-zinc-50/80 to-white">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center shadow-lg shadow-primary/30">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Riwayat Arus Kas</h2>
                  <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                    {metrics.recentTransactions.length > 0 ? `${metrics.recentTransactions.length} transaksi terakhir tercatat.` : "Belum ada aktivitas transaksi."}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/transaksi" className="hidden sm:block">
                <Button variant="outline" size="sm" className="h-9 text-xs font-bold border-zinc-200 hover:border-primary/40 hover:bg-primary/5 rounded-xl group gap-2">
                  Lihat Semua
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="p-5 sm:p-6 flex-1 space-y-3">
              {metrics.recentTransactions.length === 0 ? (
                <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-zinc-100 bg-zinc-50/60">
                  <div className="w-16 h-16 bg-white shadow-sm ring-1 ring-zinc-200 rounded-2xl flex items-center justify-center mb-4 rotate-3">
                    <Inbox className="w-8 h-8 text-zinc-300" />
                  </div>
                  <h3 className="text-base font-extrabold text-zinc-800">Belum Ada Transaksi</h3>
                  <p className="text-sm text-zinc-400 mt-1 max-w-[240px]">Catat transaksi pertama kamu untuk mulai memantau arus kas.</p>
                </div>
              ) : (
                metrics.recentTransactions.map((trx, idx) => {
                  const isIuran = trx.description.startsWith("Iuran Bln");
                  const isIncome = trx.type === "income";

                  return (
                    <div
                      key={trx.id}
                      className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-zinc-50/40 ring-1 ring-inset ring-zinc-100 hover:bg-white hover:ring-primary/20 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default overflow-hidden"
                    >
                      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity ${isIncome ? "bg-emerald-400" : "bg-rose-400"}`} />

                      <div className="flex items-center gap-4 z-10">
                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                          {isIncome ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          <div className={`absolute inset-0 rounded-2xl ring-1 ring-inset ${isIncome ? "ring-emerald-200" : "ring-rose-200"}`} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-sm sm:text-base font-extrabold text-zinc-900 leading-tight truncate">{trx.description}</p>
                            {isIuran && (
                              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-primary/10 text-primary uppercase tracking-widest border border-primary/20">Auto</span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5" suppressHydrationWarning>
                            <CalendarCheck className="w-3 h-3" />
                            {new Date(trx.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right z-10 flex-shrink-0 ml-4">
                        <div className={`text-base sm:text-xl font-black tracking-tight tabular-nums ${isIncome ? "text-emerald-600" : "text-zinc-800"}`}>
                          {isIncome ? "+" : "−"}&nbsp;Rp {trx.amount.toLocaleString("id-ID")}
                        </div>
                        <div className={`text-[10px] font-bold mt-0.5 uppercase tracking-wider ${isIncome ? "text-emerald-400" : "text-zinc-400"}`}>
                          {isIncome ? "Masuk" : "Keluar"}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-5 py-4 border-t border-zinc-100 sm:hidden bg-zinc-50/50">
              <Link href="/dashboard/transaksi">
                <Button variant="outline" className="w-full h-11 text-sm font-bold border-zinc-200 bg-white">Lihat Semua Riwayat</Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative group overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 to-purple-700 p-6 shadow-xl shadow-violet-900/20 ring-1 ring-inset ring-white/10">
              <Noise />
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Anggota</div>
                </div>

                <p className="text-violet-200/80 text-[10px] font-bold uppercase tracking-widest mb-1">Total Aktif</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-white tracking-tighter">{metrics.anggotaAktif}</span>
                  <span className="text-violet-300 text-xs font-bold uppercase">Orang</span>
                </div>

               
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 shadow-sm ring-1 ring-inset ring-zinc-200/80 flex-1">
              <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Command Center
              </h3>

              <div className="space-y-3">
                {[
                  {
                    href: "/dashboard/transaksi",
                    icon: <Plus className="w-4 h-4" />,
                    iconBg: "from-primary to-blue-600 shadow-primary/30",
                    ring: "hover:ring-primary/30",
                    title: "Catat Manual",
                    sub: "Input Transaksi Baru",
                  },
                  {
                    href: "/dashboard/iuran",
                    icon: <CalendarCheck className="w-4 h-4" />,
                    iconBg: "from-emerald-500 to-teal-600 shadow-emerald-500/30",
                    ring: "hover:ring-emerald-400/30",
                    title: "Cek Iuran",
                    sub: "Matriks Tagihan Bulanan",
                  },
                  {
                    href: "/dashboard/anggota",
                    icon: <Users className="w-4 h-4" />,
                    iconBg: "from-violet-500 to-purple-600 shadow-violet-500/30",
                    ring: "hover:ring-violet-400/30",
                    title: "Data Anggota",
                    sub: "Kelola Daftar Anggota",
                  },
                ].map((action) => (
                  <Link key={action.href} href={action.href} className="block">
                    <div className={`group flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-50/80 ring-1 ring-inset ring-zinc-100 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${action.ring}`}>
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.iconBg} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        {action.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-zinc-900 leading-tight">{action.title}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5 truncate">{action.sub}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}