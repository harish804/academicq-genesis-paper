
import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ApiService } from "@/services/api";
import { toast } from "sonner";

export function SyllabusUpload() {
  const { parseSyllabusFromText, syllabus } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file type is .txt or .docx
    const validTypes = [
      'text/plain', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a .txt or .docx file");
      return;
    }

    setFilename(file.name);
    setIsUploading(true);

    try {
      const content = await ApiService.parseSyllabusFile(file);
      parseSyllabusFromText(content);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Upload Syllabus</CardTitle>
        <CardDescription>
          Upload a .txt or .docx file containing your course syllabus to automatically extract topics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.docx"
          onChange={handleFileChange}
        />

        {syllabus ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-muted/30 p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-accent" />
            <p className="font-medium">{syllabus.meta.course}</p>
            <p className="text-sm text-muted-foreground">
              {syllabus.chapters.length} chapters, {syllabus.chapters.reduce(
                (acc, chapter) => acc + chapter.topics.length, 0
              )} topics extracted
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={handleFileSelect}
            >
              <FileText className="mr-2 h-4 w-4" />
              Upload Different File
            </Button>
          </div>
        ) : (
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center hover:bg-muted/50"
            onClick={handleFileSelect}
          >
            {isUploading ? (
              <>
                <LoadingSpinner size="md" />
                <p className="text-sm font-medium">Processing {filename}...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">Click to upload syllabus</p>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop (.txt or .docx)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
