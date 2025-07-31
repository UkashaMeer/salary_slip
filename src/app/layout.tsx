import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salary Slip App",
  description: "By Invenzee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
