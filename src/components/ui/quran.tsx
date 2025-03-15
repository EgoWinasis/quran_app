"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Info  } from "lucide-react";

function decodeHtml(html: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function toArabicNumber(num: number | string): string {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (digit) => arabicNumbers[parseInt(digit)]);
}

export default function Quran() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
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


  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setSurahs(data))
      .catch((err) => console.error("Error loading Quran:", err));
  }, []);

  const handleNext = () => {
    if (currentIndex < surahs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSurahSelect = (index: number) => {
    setCurrentIndex(index);
    setIsDropdownOpen(false);
  };

  const surah = surahs[currentIndex];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-6">
      <div className={`w-full max-w-screen-lg mx-auto ${isMobile ? "mt-15" : "mt-0"}`}>
        {surah ? (
          <>
            {/* Dropdown for Surah List */}
            <div className="relative w-full flex items-center justify-center mb-2">
              <button
                onClick={handleDropdownToggle}
                className="flex items-center gap-2 text-2xl font-bold text-gray-700 cursor-pointer"
              >
                {/* Dropdown Icon */}
                {isDropdownOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                {/* Surah Name */}
                {surah.nomor}. {surah.nama} ({surah.asma})
              </button>
              {/* Info Icon (Click to Show/Hide Info) */}
                <button onClick={() => setShowModal(true)} className="relative">
                    <Info className="mx-2 w-4 h-4 text-gray-400  cursor-pointer" />
                </button>
                 {/* Info Tooltip (Visible When Clicked) */}
                {/* Modal */}
                {showModal && (
                    <div
                        className="fixed inset-0 flex items-center justify-center"
                        onClick={() => setShowModal(false)} // Close when clicking outside the modal
                    >
                        <div
                        className="bg-white text-black p-6 rounded-lg w-200 shadow-lg relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 text-gray-600 cursor-pointer "
                            onClick={() => setShowModal(false)}
                        >
                            ✖
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">Surah Info</h2>

                        <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{ __html: surah.keterangan }}
                        />

                        {/* Additional Surah Info */}
                        <p className="mt-3">
                            <strong>Klasifikasi:</strong> {surah.type.toLowerCase() === "mekah" ? "Surat Makkiyah" : "Surat Madaniyah"}
                        </p>
                        <p><strong>Wahyu Ke- : </strong>{surah.urut}</p>
                        </div>
                    </div>
                    )}



              {/* Dropdown Content */}
              {isDropdownOpen && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-md w-64 max-h-64 overflow-y-auto z-10">
                  {surahs.map((s, index) => (
                    <button
                      key={index}
                      className={`block w-full text-left px-4 py-2 ${
                        index === currentIndex ? "bg-gray-300" : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleSurahSelect(index)}
                    >
                      {s.nomor}. {s.nama} ({s.asma})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-gray-600 italic text-center">{surah.arti}</p>

            {/* Ayah List */}
            <div className="mt-4 pb-24">
              {surah.ayat.map((ayah: any, index: number) => (
                <div key={index} className="border-b py-4">
                  <p className="text-2xl font-arabic m-2 text-right" style={{ fontFamily: "'Amiri', serif",lineHeight: "3", direction: "rtl" }}>
                    {ayah.ar} <span className="inline-block text-lg text-gray-600">({toArabicNumber(ayah.nomor)})</span>
                  </p>
                  <p className="p-2" dangerouslySetInnerHTML={{ __html: ayah.tr }}></p>
                  <p className="text-gray-500 p-2">{ayah.nomor}. {ayah.id}</p>
                </div>
              ))}
            </div>

            {/* Sticky Bottom Navigation */}
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white shadow-md p-2 sm:p-4 flex items-center justify-between gap-2 sm:gap-4 rounded-t-lg sm:rounded-lg w-full sm:w-auto">
            <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
            >
                <ChevronLeft size={20} /> Previous
            </button>

            <audio key={surah.nomor} controls className="flex-1 sm:flex-auto w-full sm:w-auto">
                <source src={surah.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            <button
                onClick={handleNext}
                disabled={currentIndex === surahs.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50 cursor-pointer" 
            >
                Next <ChevronRight size={20} />
            </button>
            </div>

          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
}
