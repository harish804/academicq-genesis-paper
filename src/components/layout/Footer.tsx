
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <div className="h-4 w-4 text-primary-foreground font-bold text-xs">AQ</div>
            </div>
            <span className="text-sm font-semibold">AcademicQ</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            © {currentYear} AcademicQ. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link to="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
