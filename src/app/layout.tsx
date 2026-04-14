import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Film-for-All",
  description: "Discover films with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">🎬 Film-for-All</h1>
            <p className="text-gray-400 text-sm">Discover films with AI-powered insights</p>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
