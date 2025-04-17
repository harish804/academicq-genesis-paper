
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="mb-8 mt-2 text-xl text-muted-foreground">
          Oops! This page is missing from our question bank.
        </p>
        
        <Button asChild>
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
