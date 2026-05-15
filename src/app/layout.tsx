// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster Sonner

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kas Kita",
  description: "Aplikasi pencatatan kas modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
        {/* Pasang di mari, kasih posisi di atas tengah biar modern */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}