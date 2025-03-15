import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/ui/sidebar";
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex items-center justify-between">
      <div className="text-lg font-bold">MyApp</div>

      {/* Mobile Sidebar Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar Links */}
      <div className="hidden lg:flex gap-6">
        <Link href="/" className="hover:text-blue-500">Home</Link>
        <Link href="/about" className="hover:text-blue-500">About</Link>
        <Link href="/contact" className="hover:text-blue-500">Contact</Link>
      </div>
    </nav>
  );
}
