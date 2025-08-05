import type { Metadata } from "next";
// import { Toaster } from "@/components/ui/sonner"
import { Inter } from 'next/font/google'
import "./globals.css";

export const metadata: Metadata = {
  title: "Salary Slip App",
  description: "By Invenzee",
};

const InterFont = Inter({
    subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${InterFont.className}`}
      >
        {children}
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
