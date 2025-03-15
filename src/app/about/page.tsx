"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // If width < 768px, it's mobile
    };

    checkScreenSize(); // Run on initial render
    window.addEventListener("resize", checkScreenSize); // Listen for resize

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 ${isMobile ? "mt-4" : ""}`}>
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center">
        <Image
          src="/profile.jpg" // Replace with your image path
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full shadow-lg"
        />
        <h1 className="text-3xl font-bold mt-4 text-gray-900">Ego Winasis</h1>
        <p className="text-gray-600 text-lg">FullStack Developer | Tech Enthusiast</p>
      </div>

      {/* Biodata Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-6 text-center">
        <h2 className="text-2xl font-semibold border-b pb-2">Biodata</h2>
        <ul className="mt-4 text-gray-700 space-y-2">
          <li><strong>📧 Email:</strong> egowinasis12@gmail.com</li>
          <li><strong>🏠 Location:</strong> Tegal, Indonesia</li>
          <li><strong>💼 Occupation:</strong></li>
          <ul className="ml-4">
            <li>FullStack Developer</li>
            <li>Network Engineer</li>
          </ul>
        </ul>
      </div>

      {/* Social Media Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-6 text-center">
        <h2 className="text-2xl font-semibold border-b pb-2">Connect with Me</h2>
        <div className="flex justify-center mt-4 space-x-6">
          <a href="https://facebook.com/egowinasis" target="_blank" className="text-blue-600 hover:scale-110 transition-transform">
            <Facebook size={32} />
          </a>
          <a href="https://instagram.com/egowinasis" target="_blank" className="text-pink-500 hover:scale-110 transition-transform">
            <Instagram size={32} />
          </a>
          <a href="https://www.linkedin.com/in/ego-winasis-2178b2180/" target="_blank" className="text-blue-700 hover:scale-110 transition-transform">
            <Linkedin size={32} />
          </a>
          <a href="https://github.com/egowinasis" target="_blank" className="text-blue-700 hover:scale-110 transition-transform">
            <Github size={32} />
          </a>
        </div>
      </div>
    </div>
  );
}
