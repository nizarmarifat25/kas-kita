// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from 'nextjs-toploader'; // <-- 1. Import ini
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kas Kita",
  description: "Sistem Manajemen Kas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* 2. Pasang di sini bre, warnanya gua set biru primary (#3b82f6) */}
        <NextTopLoader color="oklch(0.723 0.219 149.579)" showSpinner={false} height={3} shadow="0 0 10px #3b82f6,0 0 5px #3b82f6" />
        
        {children}
      </body>
    </html>
  );
}