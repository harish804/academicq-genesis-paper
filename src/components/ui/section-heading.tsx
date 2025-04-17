
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ 
  title, 
  description, 
  className 
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
