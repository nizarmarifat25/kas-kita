// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader"; // <-- 1. Import ini
import "./globals.css";
import { Toaster } from "sonner";

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
        <NextTopLoader
          color="oklch(0.723 0.219 149.579)"
          showSpinner={false}
          height={3}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        <Toaster position="top-center" richColors />

        {children}
      </body>
    </html>
  );
}
