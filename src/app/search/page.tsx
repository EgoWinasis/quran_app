"use client";

import { useState, useEffect } from "react";

interface Ayat {
  nomor: number;
  ar: string;
  tr: string;
  id: string;
  surahName?: string; // Ditambahkan untuk menyimpan nama surah
  surahNumber?: number; // Ditambahkan untuk menyimpan nomor surah
  verseNumber?: number; // Nomor ayat dalam surah
}

interface Surah {
  nomor: number;
  nama: string;
  ayat: Ayat[];
}

function toArabicNumber(num: number | string): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (digit) => arabicNumbers[parseInt(digit)]);
}

const SearchPage = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]); // Data lengkap Quran
  const [searchQuery, setSearchQuery] = useState(""); // Input pencarian
  const [filteredVerses, setFilteredVerses] = useState<Ayat[]>([]); // Hasil pencarian
  const [isLoading, setIsLoading] = useState(false); // Status loading
  const [isMobile, setIsMobile] = useState(false); // Deteksi mode mobile

  useEffect(() => {
    // Deteksi ukuran layar
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch data Quran dari JSON
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded JSON Data:", data);
        setSurahs(data);
      })
      .catch((err) => console.error("Error loading Quran:", err));
  }, []);


  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      const filtered: Ayat[] = [];
      const searchRegex = new RegExp(`\\b${searchQuery}\\b`, "i");

      surahs.forEach((surah) => {
        surah.ayat.forEach((ayat) => {
          if (searchRegex.test(ayat.id)) {
            filtered.push({
              ...ayat,
              surahName: surah.nama, // Simpan nama surah
              surahNumber: surah.nomor, // Simpan nomor surah
              verseNumber: ayat.nomor, // Simpan nomor ayat
            });
          }
        });
      });

      setFilteredVerses(filtered);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className={`p-6 max-w-3xl mx-auto ${isMobile ? "mt-15" : "mt-0"}`}>
      <h1 className="text-2xl font-bold mb-4 text-center">Cari Ayat</h1>

      {/* Input Pencarian */}
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

      {/* Spinner Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Menampilkan Hasil Pencarian */}
      {filteredVerses.length > 0 ? (
        filteredVerses.map((verse, index) => (
          <div key={index} className="p-4 border-b">
            <h2 className="text-lg font-bold">
              {index + 1}. {verse.surahName} - [ {toArabicNumber(verse.surahNumber!)}:{toArabicNumber(verse.verseNumber!)} ]
            </h2>
            <p className="text-2xl font-arabic m-2 text-right p-3" style={{ fontFamily: "'Amiri', serif", lineHeight: "3", direction: "rtl" }}>
              {verse.ar} <span className="inline-block text-lg text-gray-600">({toArabicNumber(verse.verseNumber!)})</span>
            </p>
            <p className="italic p-3" dangerouslySetInnerHTML={{ __html: verse.tr }} />
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
