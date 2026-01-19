import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const crimsonPro = Crimson_Pro({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WTFiction — Speculative Scenarios Before They Happen",
  description: "WTFiction explores the consequences of science, technology, and power — before they happen. Each episode examines a single scenario grounded in real science, economics, and geopolitics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${crimsonPro.variable} ${inter.variable} antialiased`}
      >
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
