
import { useApp } from "@/context/AppContext";
import { ApiService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeading } from "@/components/ui/section-heading";
import { QuestionCard } from "@/components/question-card";
import { SyllabusUpload } from "@/components/syllabus-upload";
import { Grid3X3, DownloadCloud } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function GeneratePage() {
  const { 
    questions, 
    addQuestion, 
    removeQuestion,
    syllabus,
    isGenerating, 
    setIsGenerating 
  } = useApp();
  
  const [topic, setTopic] = useState("");
  const [marks, setMarks] = useState(1);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [bloomLevel, setBloomLevel] = useState<"Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create">("Understand");
  const [type, setType] = useState<"Objective" | "Descriptive">("Objective");

  const handleGenerateQuestion = async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    
    const newQuestion = await ApiService.generateQuestion(
      topic,
      marks,
      difficulty,
      bloomLevel,
      type
    );
    
    if (newQuestion) {
      addQuestion(newQuestion);
    }
    
    setIsGenerating(false);
  };

  const handleRegenerateQuestion = async (question: any) => {
    setIsGenerating(true);
    
    const regeneratedQuestion = await ApiService.generateQuestion(
      question.topic,
      question.marks,
      question.difficulty,
      question.bloomLevel,
      question.type
    );
    
    if (regeneratedQuestion) {
      // Remove the old question
      removeQuestion(question.id);
      // Add the new question
      addQuestion(regeneratedQuestion);
    }
    
    setIsGenerating(false);
  };

  const handleExportQuestions = () => {
    if (questions.length === 0) return;
    ApiService.exportToPdf(questions, "Generated Questions");
  };

  const handleSelectTopic = (selectedTopic: string) => {
    setTopic(selectedTopic);
  };

  return (
    <div className="container py-8">
      <SectionHeading 
        title="Generate Questions" 
        description="Create individual questions with specific parameters"
      />
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          {/* Syllabus Upload Card */}
          <SyllabusUpload />
          
          {/* Question Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle>Question Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleGenerateQuestion(); }}>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  {syllabus ? (
                    <Select onValueChange={handleSelectTopic} value={topic}>
                      <SelectTrigger id="topic">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {syllabus.chapters.map((chapter) => (
                          <div key={chapter.name}>
                            <div className="px-2 py-1.5 text-sm font-semibold bg-muted/50">
                              {chapter.name}
                            </div>
                            {chapter.topics.map((topic) => (
                              <SelectItem key={topic} value={topic}>
                                {topic}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="topic"
                      placeholder="Enter topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marks">Marks</Label>
                    <Select 
                      value={marks.toString()} 
                      onValueChange={(value) => setMarks(parseInt(value))}
                    >
                      <SelectTrigger id="marks">
                        <SelectValue placeholder="Marks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Mark</SelectItem>
                        <SelectItem value="2">2 Marks</SelectItem>
                        <SelectItem value="5">5 Marks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select 
                      value={difficulty} 
                      onValueChange={(value) => setDifficulty(value as any)}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloom">Bloom's Taxonomy Level</Label>
                  <Select 
                    value={bloomLevel} 
                    onValueChange={(value) => setBloomLevel(value as any)}
                  >
                    <SelectTrigger id="bloom">
                      <SelectValue placeholder="Bloom's Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remember">Remember</SelectItem>
                      <SelectItem value="Understand">Understand</SelectItem>
                      <SelectItem value="Apply">Apply</SelectItem>
                      <SelectItem value="Analyze">Analyze</SelectItem>
                      <SelectItem value="Evaluate">Evaluate</SelectItem>
                      <SelectItem value="Create">Create</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Question Type</Label>
                  <Select 
                    value={type} 
                    onValueChange={(value) => setType(value as any)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Objective">Objective</SelectItem>
                      <SelectItem value="Descriptive">Descriptive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!topic || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate Question"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Generated Questions Display */}
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Generated Questions <span className="text-sm font-normal text-muted-foreground">({questions.length})</span>
            </h2>
            
            {questions.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExportQuestions}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            )}
          </div>
          
          {questions.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Grid3X3 className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No questions generated yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Set parameters and click "Generate Question" to create new questions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...questions].reverse().map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onDelete={removeQuestion}
                  onRegenerate={handleRegenerateQuestion}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
