import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionCard } from "@/components/question-card";
import { ApiService } from "@/services/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText, FilePlus2, DownloadCloud, Loader2 } from "lucide-react";
import { SyllabusUpload } from "@/components/syllabus-upload";

export default function BlueprintPage() {
  const {
    syllabus,
    blueprintConfig,
    setBlueprintConfig,
    generateBlueprint,
    isGenerating,
    setIsGenerating,
  } = useApp();

  const [blueprintQuestions, setBlueprintQuestions] = useState<any[]>([]);

  const handleCreateBlueprint = () => {
    setIsGenerating(true);
    
    // Generate blueprint with a slight delay to show loading state
    setTimeout(() => {
      const questions = generateBlueprint();
      setBlueprintQuestions(questions);
      setIsGenerating(false);
    }, 1500);
  };

  const handleExportBlueprint = () => {
    if (blueprintQuestions.length === 0) return;
    ApiService.exportToPdf(blueprintQuestions, blueprintConfig.paperTitle);
  };

  const updateConfig = (field: string, value: any) => {
    setBlueprintConfig({
      ...blueprintConfig,
      [field]: value,
    });
  };

  const updateSectionConfig = (section: 'a' | 'b', field: string, value: any) => {
    setBlueprintConfig({
      ...blueprintConfig,
      sections: {
        ...blueprintConfig.sections,
        [section]: {
          ...blueprintConfig.sections[section],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="container py-8">
      <SectionHeading 
        title="Question Paper Blueprint" 
        description="Create a complete question paper with sections and distribution"
      />
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          {/* Syllabus Upload if not already uploaded */}
          {!syllabus && <SyllabusUpload />}
          
          {/* Blueprint Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Paper Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paperTitle">Paper Title</Label>
                  <Input
                    id="paperTitle"
                    placeholder="Enter paper title"
                    value={blueprintConfig.paperTitle}
                    onChange={(e) => updateConfig('paperTitle', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxMarks">Max Marks</Label>
                    <Input
                      id="maxMarks"
                      type="number"
                      min="1"
                      value={blueprintConfig.maxMarks}
                      onChange={(e) => updateConfig('maxMarks', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time (minutes)</Label>
                    <Input
                      id="time"
                      type="number"
                      min="1"
                      value={blueprintConfig.time}
                      onChange={(e) => updateConfig('time', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Overall Difficulty</Label>
                  <Select
                    value={blueprintConfig.difficulty}
                    onValueChange={(value) => updateConfig('difficulty', value)}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Section A Configuration */}
                <div className="rounded-md border bg-muted/30 p-3">
                  <h4 className="mb-3 font-medium">Section A: One-Mark Questions</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="oneMarkCount" className="text-sm">Number of Questions</Label>
                      <Input
                        id="oneMarkCount"
                        type="number"
                        min="1"
                        className="h-8"
                        value={blueprintConfig.sections.a.oneMarkQuestionsCount}
                        onChange={(e) => updateSectionConfig('a', 'oneMarkQuestionsCount', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chaptersA" className="text-sm">Chapters to Include</Label>
                      {syllabus ? (
                        <Select
                          onValueChange={(value) => {
                            const selectedChapters = value === "all" 
                              ? syllabus.chapters.map(c => c.name)
                              : [value];
                            
                            updateSectionConfig('a', 'chaptersToInclude', selectedChapters);
                          }}
                        >
                          <SelectTrigger id="chaptersA">
                            <SelectValue placeholder="Select chapters" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Chapters</SelectItem>
                            {syllabus.chapters.map((chapter) => (
                              <SelectItem key={chapter.name} value={chapter.name}>
                                {chapter.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Upload syllabus to select chapters
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Section B Configuration */}
                <div className="rounded-md border bg-muted/30 p-3">
                  <h4 className="mb-3 font-medium">Section B: Five-Mark Questions</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="fiveMarkPerChapter" className="text-sm">Questions Per Chapter</Label>
                      <Input
                        id="fiveMarkPerChapter"
                        type="number"
                        min="1"
                        className="h-8"
                        value={blueprintConfig.sections.b.fiveMarkQuestionsPerChapter}
                        onChange={(e) => updateSectionConfig('b', 'fiveMarkQuestionsPerChapter', parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Each question will have two choices (a/b)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chaptersB" className="text-sm">Chapters to Include</Label>
                      {syllabus ? (
                        <Select
                          onValueChange={(value) => {
                            const selectedChapters = value === "all" 
                              ? syllabus.chapters.map(c => c.name)
                              : [value];
                            
                            updateSectionConfig('b', 'chaptersToInclude', selectedChapters);
                          }}
                        >
                          <SelectTrigger id="chaptersB">
                            <SelectValue placeholder="Select chapters" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Chapters</SelectItem>
                            {syllabus.chapters.map((chapter) => (
                              <SelectItem key={chapter.name} value={chapter.name}>
                                {chapter.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Upload syllabus to select chapters
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleCreateBlueprint}
                  disabled={isGenerating || !syllabus}
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Generating Paper...
                    </>
                  ) : (
                    <>
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Generate Question Paper
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Question Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Section A Questions</Label>
                  <Input
                    type="number"
                    min="1"
                    value={blueprintConfig.numberOfQuestions.sectionA}
                    onChange={(e) => {
                      setBlueprintConfig({
                        ...blueprintConfig,
                        numberOfQuestions: {
                          ...blueprintConfig.numberOfQuestions,
                          sectionA: parseInt(e.target.value)
                        }
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section B Question Sets</Label>
                  <Input
                    type="number"
                    min="1"
                    value={blueprintConfig.numberOfQuestions.sectionB}
                    onChange={(e) => {
                      setBlueprintConfig({
                        ...blueprintConfig,
                        numberOfQuestions: {
                          ...blueprintConfig.numberOfQuestions,
                          sectionB: parseInt(e.target.value)
                        }
                      });
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Generated Blueprint Display */}
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Question Paper Preview
            </h2>
            
            {blueprintQuestions.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleExportBlueprint}>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            )}
          </div>
          
          {blueprintQuestions.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No question paper generated yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Configure your paper settings and click "Generate Question Paper"
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Paper Header */}
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{blueprintConfig.paperTitle}</h2>
                    <div className="mt-2 flex justify-center gap-8 text-sm">
                      <span>Time: {blueprintConfig.time} minutes</span>
                      <span>Max Marks: {blueprintConfig.maxMarks}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Section A: One-mark questions */}
              {blueprintQuestions.some(q => q.marks === 1) && (
                <div>
                  <h3 className="mb-3 text-lg font-medium">Section A - One Mark Questions</h3>
                  <div className="space-y-3">
                    {blueprintQuestions
                      .filter(q => q.marks === 1)
                      .map(question => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          showActions={false}
                        />
                      ))}
                  </div>
                </div>
              )}
              
              {/* Section B: Five-mark questions */}
              {blueprintQuestions.some(q => q.marks === 5) && (
                <div>
                  <h3 className="mb-3 text-lg font-medium">Section B - Descriptive Questions</h3>
                  <div className="space-y-6">
                    {Array.from({ length: blueprintQuestions.filter(q => q.id.endsWith('a')).length }).map((_, idx) => {
                      const questionIndex = idx + 1;
                      const questionA = blueprintQuestions.find(q => q.id === `B${questionIndex}a`);
                      const questionB = blueprintQuestions.find(q => q.id === `B${questionIndex}b`);
                      
                      return (
                        <div key={`question-set-${questionIndex}`} className="space-y-2">
                          <h4 className="font-medium">Question {questionIndex} (Choose any one)</h4>
                          <div className="grid gap-2 md:grid-cols-2">
                            {questionA && (
                              <QuestionCard
                                question={questionA}
                                showActions={false}
                              />
                            )}
                            {questionB && (
                              <QuestionCard
                                question={questionB}
                                showActions={false}
                                isAlternate={true}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
