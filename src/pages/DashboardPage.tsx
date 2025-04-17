
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/question-card";
import { ApiService } from "@/services/api";
import { DownloadCloud, Trash2, FileText } from "lucide-react";
import { SyllabusUpload } from "@/components/syllabus-upload";

export default function DashboardPage() {
  const { questions, removeQuestion, clearQuestions, syllabus } = useApp();
  const [activeTab, setActiveTab] = useState("questions");

  const handleExportQuestions = () => {
    if (questions.length === 0) return;
    ApiService.exportToPdf(questions, "All Questions");
  };

  const handleClearQuestions = () => {
    if (confirm("Are you sure you want to delete all generated questions?")) {
      clearQuestions();
    }
  };

  return (
    <div className="container py-8">
      <SectionHeading 
        title="Dashboard" 
        description="Manage your questions, papers, and syllabus"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions">Generated Questions</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        {/* Questions Tab */}
        <TabsContent value="questions">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">
              All Generated Questions <span className="text-sm font-normal text-muted-foreground">({questions.length})</span>
            </h3>
            
            <div className="flex gap-2">
              {questions.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={handleExportQuestions}>
                    <DownloadCloud className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handleClearQuestions}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {questions.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No questions yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Generate questions from the "Generate Questions" page.
              </p>
              <Button className="mt-4" asChild>
                <a href="/generate">Generate Questions</a>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onDelete={removeQuestion}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Syllabus Tab */}
        <TabsContent value="syllabus">
          <div className="mb-4">
            <h3 className="font-medium">Course Syllabus</h3>
          </div>
          
          {!syllabus ? (
            <SyllabusUpload />
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{syllabus.meta.course}</CardTitle>
                  <CardDescription>
                    {syllabus.meta.code && `Code: ${syllabus.meta.code}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {syllabus.meta.description && (
                    <p className="mb-4 text-sm">{syllabus.meta.description}</p>
                  )}
                </CardContent>
              </Card>
              
              <div className="space-y-4">
                {syllabus.chapters.map((chapter, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{chapter.name}</CardTitle>
                      <CardDescription>
                        {chapter.topics.length} topics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {chapter.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="text-sm">
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Statistics Tab */}
        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{questions.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  By Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Easy</span>
                    <span className="text-sm font-medium">
                      {questions.filter(q => q.difficulty === "Easy").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Medium</span>
                    <span className="text-sm font-medium">
                      {questions.filter(q => q.difficulty === "Medium").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hard</span>
                    <span className="text-sm font-medium">
                      {questions.filter(q => q.difficulty === "Hard").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  By Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Objective</span>
                    <span className="text-sm font-medium">
                      {questions.filter(q => q.type === "Objective").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Descriptive</span>
                    <span className="text-sm font-medium">
                      {questions.filter(q => q.type === "Descriptive").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  By Bloom's Taxonomy Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                  {["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"].map(level => (
                    <Card key={level} className="overflow-hidden">
                      <div className="bg-muted/50 p-2 text-center text-xs font-medium">
                        {level}
                      </div>
                      <div className="p-3 text-center text-2xl font-bold">
                        {questions.filter(q => q.bloomLevel === level).length}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
