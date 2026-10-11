import type { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
export const metadata = {
  title: "বাজার দর | BazarDor",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn" data-theme="light">
      <body className="min-h-screen flex flex-col">
        <Toaster position="top-center" />
        <Navbar />
        <Ticker />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="border-t border-green-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500">
            <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
            <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
