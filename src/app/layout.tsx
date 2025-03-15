"use client";

import { useState } from "react";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true); // Sidebar state

  return (
    <html lang="en">
      <body className="flex">
        {/* Pass both isOpen and setIsOpen to Sidebar */}
        <Sidebar />
        <main className={` w-full`}>
          {children}
        </main>
      </body>
    </html>
  );
}

