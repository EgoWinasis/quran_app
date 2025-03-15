"use client";

import { useState, useEffect } from "react";

// Define interfaces for TypeScript
interface Ayat {
  nomor: number;
  ar: string;
  tr: string;
  id: string;
}

interface Surah {
  nomor: number;
  nama: string;
  ayat: Ayat[];
}

// Convert numbers to Arabic numerals
function toArabicNumber(num: number | string): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (digit) => arabicNumbers[parseInt(digit)]);
}

const SearchPage = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]); // Store all surahs
  const [searchQuery, setSearchQuery] = useState(""); // User input
  const [filteredVerses, setFilteredVerses] = useState<Ayat[]>([]); // Filtered results
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check screen width
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // If width < 768px, it's mobile
    };

    checkScreenSize(); // Run on initial render
    window.addEventListener("resize", checkScreenSize); // Listen for resize

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  // Fetch data.json only once
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data: Surah[]) => {
        console.log("Loaded JSON Data:", data);
        setSurahs(data);
      })
      .catch((err) => console.error("Error loading Quran:", err));
  }, []);

  // Handle search execution
  const handleSearch = () => {
    if (!searchQuery.trim()) return; // Prevent empty search
    setIsLoading(true);
  
    setTimeout(() => {
      const filtered: Ayat[] = [];
      const searchRegex = new RegExp(`\\b${searchQuery}\\b`, "i"); // Match whole word case-insensitively
  
      surahs.forEach((surah) => {
        surah.ayat.forEach((ayat) => {
          if (searchRegex.test(ayat.id)) { // Check whole word match
            filtered.push({
              ...ayat,
              nomor: ayat.nomor,
            });
          }
        });
      });

      setFilteredVerses(filtered);
      setIsLoading(false);
    }, 500); // Simulating lazy loading (debounce effect)
  };

  return (
    <div className={`p-6 max-w-3xl mx-auto ${isMobile ? "mt-15" : "mt-0"}`}>

      <h1 className="text-2xl font-bold mb-4 text-center">Cari Ayat</h1>

      {/* Search Input + Button */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Cari kata dalam terjemahan Indonesia..."
          className="flex-1 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSearch}
        >
          Cari
        </button>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Display Results */}
      {filteredVerses.length > 0 ? (
        filteredVerses.map((verse, index) => (
          <div key={index} className="p-4 border-b">
            <h2 className="text-lg font-bold">
              {index + 1}. [ {toArabicNumber(verse.nomor)} ]
            </h2>
            <p className="text-2xl font-arabic m-2 text-right p-3" style={{ fontFamily: "'Amiri', serif", lineHeight: "3", direction: "rtl" }}>
              {verse.ar} <span className="inline-block text-lg text-gray-600">({toArabicNumber(verse.nomor)})</span>
            </p>
            <p
              className="italic p-3"
              dangerouslySetInnerHTML={{ __html: verse.tr }}
            />
            <p className="text-gray-700 p-3">{verse.id}</p>
          </div>
        ))
      ) : (
        !isLoading && <p className="text-red-500 text-center">Tidak ada hasil ditemukan.</p>
      )}
    </div>
  );
};

export default SearchPage;
