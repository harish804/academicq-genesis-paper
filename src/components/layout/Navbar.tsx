
import { CircleUser, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1.5">
              <div className="h-6 w-6 text-primary-foreground font-bold">AQ</div>
            </div>
            <span className="hidden text-xl font-bold sm:inline-block">AcademicQ</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/generate" className="text-sm font-medium hover:text-primary transition-colors">
            Generate Questions
          </Link>
          <Link to="/blueprint" className="text-sm font-medium hover:text-primary transition-colors">
            Paper Blueprint
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
          
          <Button 
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'flex' : 'hidden'} flex-col w-full bg-white border-t`}>
        <Link to="/" className="px-4 py-3 text-sm hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
          Home
        </Link>
        <Link to="/generate" className="px-4 py-3 text-sm hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
          Generate Questions
        </Link>
        <Link to="/blueprint" className="px-4 py-3 text-sm hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
          Paper Blueprint
        </Link>
        <Link to="/dashboard" className="px-4 py-3 text-sm hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
          Dashboard
        </Link>
      </div>
    </header>
  );
}
