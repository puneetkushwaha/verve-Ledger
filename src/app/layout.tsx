import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verve Ledger - Enterprise Business Intelligence",
  description: "Premium Retail OS and Business Intelligence Framework engineered by Verve Nova Technologies.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#02010a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-[#02010a] text-white overflow-x-hidden m-0 p-0 font-inter">
        <Providers>
          {children}
          <Toaster position="top-right" richColors theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
