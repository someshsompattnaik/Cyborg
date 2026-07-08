import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MobileNav, Sidebar } from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyborg | SOC Threat Intelligence Platform",
  description:
    "Cyborg is a dark-themed cybersecurity SOC platform for threat intelligence, indicators, IOC lookups, and IP reputation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="cyborg-shell min-h-screen">
          <Sidebar />
          <MobileNav />
          <div className="xl:pl-72">
            <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
