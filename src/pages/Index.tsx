
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, FileOutput, Settings, PlusCircle } from "lucide-react";

export default function Index() {
  return (
    <div className="container py-8 md:py-12">
      {/* Hero section */}
      <section className="mx-auto max-w-3xl text-center">
        <div className="rounded-lg bg-gradient-to-br from-primary/80 to-primary p-1">
          <div className="rounded-md bg-background px-4 py-2">
            <p className="text-sm font-medium text-primary">AI-Powered Question Generation</p>
          </div>
        </div>
        
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Generate Engineering Exam Papers with AI
        </h1>
        
        <p className="mt-4 text-lg text-muted-foreground">
          Create high-quality question papers with proper taxonomy levels, course outcomes, and program outcomes in minutes.
        </p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/generate">
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Questions
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link to="/blueprint">
              <FileOutput className="mr-2 h-4 w-4" />
              Create Question Paper
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Features section */}
      <section className="mt-16 md:mt-20">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
          Features
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>AI Question Generation</CardTitle>
              <CardDescription>
                Generate questions with specific difficulty, taxonomy level, and mark weightage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Control difficulty levels</li>
                <li>Set Bloom's taxonomy levels</li>
                <li>Choose between objective or descriptive</li>
                <li>Auto-assign CO and PO mappings</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Syllabus Processing</CardTitle>
              <CardDescription>
                Upload syllabus documents to automatically extract topics and units.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Support for .txt and .docx files</li>
                <li>Automatic chapter detection</li>
                <li>Topic extraction and organization</li>
                <li>Course information parsing</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Question Paper Blueprint</CardTitle>
              <CardDescription>
                Create complete question papers with proper structure and distribution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Section A: One-mark questions</li>
                <li>Section B: Descriptive questions with choices</li>
                <li>Balanced distribution across chapters</li>
                <li>Export as PDF for distribution</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="mt-16 md:mt-20">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight">
          How It Works
        </h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              1
            </div>
            <h3 className="mt-4 font-medium">Upload Your Syllabus</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Start by uploading your course syllabus file to extract chapters and topics.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              2
            </div>
            <h3 className="mt-4 font-medium">Configure Your Paper</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Set up question types, difficulty levels, and distribution across topics.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              3
            </div>
            <h3 className="mt-4 font-medium">Generate & Export</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Generate your complete question paper and export it as a PDF.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="mx-auto mt-20 max-w-3xl rounded-lg border bg-muted/30 p-8 text-center">
        <h2 className="text-xl font-bold">Ready to create your first question paper?</h2>
        <p className="mt-2 text-muted-foreground">
          Get started in minutes with our intuitive interface.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link to="/generate">
              <PlusCircle className="mr-2 h-4 w-4" />
              Generate Questions
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <Settings className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
