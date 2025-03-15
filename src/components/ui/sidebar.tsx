"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Info, Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center fixed top-0 w-full z-50 shadow-lg">
        <h2 className="text-lg font-bold">Al-Quran App</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {isOpen && (
          <nav className="absolute top-12 left-0 w-full bg-gray-900 p-4 shadow-lg">
            <ul className="space-y-3">
              {[
                { icon: BookOpen, label: "Al-Quran", path: "/" },
                { icon: Search, label: "Cari Ayat", path: "/search" },
                { icon: Info, label: "About", path: "/about" },
              ].map(({ icon: Icon, label, path }, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-gray-700 rounded cursor-pointer flex items-center gap-3"
                  onClick={() => {
                    router.push(path);
                    setIsOpen(false);
                  }}
                >
                  <Icon size={28} className="text-white" />
                  <span className="text-sm">{label}</span>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-full bg-gray-900 text-white p-4 w-20">
      <nav className="mt-5">
        <ul className="space-y-3">
          <li className="group relative p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => router.push("/")}>  
            <BookOpen className="w-8 h-8" />
            <span className="absolute left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-3 py-1 rounded w-max whitespace-nowrap transition">
              Al-Quran
            </span>
          </li>
          <li className="group relative p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => router.push("/search")}>  
            <Search className="w-8 h-8" />
            <span className="absolute left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-3 py-1 rounded w-max whitespace-nowrap transition">
              Cari Ayat
            </span>
          </li>
          <li className="group relative p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => router.push("/about")}>  
            <Info className="w-8 h-8" />
            <span className="absolute left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-3 py-1 rounded w-max whitespace-nowrap transition">
              About
            </span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
