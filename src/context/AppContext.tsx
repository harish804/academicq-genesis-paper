import { createContext, useContext, ReactNode, useState } from "react";
import { toast } from "sonner";

// Types
export type Difficulty = "Easy" | "Medium" | "Hard";
export type BloomLevel = "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
export type QuestionType = "Objective" | "Descriptive";

export interface Question {
  id: string;
  topic: string;
  marks: number;
  difficulty: Difficulty;
  bloomLevel: BloomLevel;
  type: QuestionType;
  content: string;
  courseOutcome: string;
  programOutcome: string;
  chapter?: string;
}

export interface SyllabusChapter {
  name: string;
  topics: string[];
}

export interface SyllabusMeta {
  course: string;
  code: string;
  description: string;
}

export interface Syllabus {
  meta: SyllabusMeta;
  chapters: SyllabusChapter[];
}

export interface BlueprintConfig {
  paperTitle: string;
  maxMarks: number;
  time: number;
  difficulty: Difficulty;
  sections: {
    a: {
      oneMarkQuestionsCount: number;
      chaptersToInclude: string[];
    };
    b: {
      fiveMarkQuestionsPerChapter: number;
      chaptersToInclude: string[];
    };
  };
}

interface AppContextType {
  // Questions
  questions: Question[];
  addQuestion: (question: Question) => void;
  removeQuestion: (id: string) => void;
  clearQuestions: () => void;
  
  // Syllabus
  syllabus: Syllabus | null;
  setSyllabus: (syllabus: Syllabus | null) => void;
  parseSyllabusFromText: (text: string) => void;
  
  // Blueprint
  blueprintConfig: BlueprintConfig;
  setBlueprintConfig: (config: BlueprintConfig) => void;
  generateBlueprint: () => Question[];
  
  // Loading states
  isGenerating: boolean;
  setIsGenerating: (status: boolean) => void;
}

const defaultBlueprintConfig: BlueprintConfig = {
  paperTitle: "Engineering Exam",
  maxMarks: 60,
  time: 180,
  difficulty: "Medium",
  sections: {
    a: {
      oneMarkQuestionsCount: 10,
      chaptersToInclude: [],
    },
    b: {
      fiveMarkQuestionsPerChapter: 2,
      chaptersToInclude: [],
    },
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [blueprintConfig, setBlueprintConfig] = useState<BlueprintConfig>(defaultBlueprintConfig);
  const [isGenerating, setIsGenerating] = useState(false);

  const addQuestion = (question: Question) => {
    setQuestions(prev => [...prev, question]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const clearQuestions = () => {
    setQuestions([]);
  };

  const parseSyllabusFromText = (text: string) => {
    try {
      // This is a simple parser. In a production app, this would be more robust
      const lines = text.split('\n').filter(line => line.trim());
      
      let courseName = "";
      let courseCode = "";
      let description = "";
      const chapters: SyllabusChapter[] = [];
      
      let currentChapter: SyllabusChapter | null = null;
      
      // Find course details (first few lines usually)
      if (lines.length > 0) {
        courseName = lines[0].trim();
        if (lines.length > 1) {
          const codeMatch = lines[1].match(/([A-Z0-9]+)/);
          courseCode = codeMatch ? codeMatch[0] : "";
          description = lines.length > 2 ? lines[2].trim() : "";
        }
      }
      
      // Process the rest of the lines looking for chapters and topics
      for (let i = 3; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // If line contains "chapter", "unit", "module" - it's likely a chapter heading
        if (/chapter|unit|module/i.test(line)) {
          if (currentChapter) {
            chapters.push(currentChapter);
          }
          currentChapter = {
            name: line,
            topics: []
          };
        } 
        // Otherwise, if we have a current chapter and the line is not empty, it's a topic
        else if (currentChapter && line) {
          // Remove bullet points, numbers at start if any
          const topic = line.replace(/^[-*•]|\d+\.|\s*/, '').trim();
          if (topic) {
            currentChapter.topics.push(topic);
          }
        }
      }
      
      // Don't forget to add the last chapter if there is one
      if (currentChapter) {
        chapters.push(currentChapter);
      }
      
      setSyllabus({
        meta: {
          course: courseName,
          code: courseCode,
          description
        },
        chapters
      });
      
      // Update blueprint config with the chapters
      if (chapters.length > 0) {
        const chapterNames = chapters.map(c => c.name);
        setBlueprintConfig(prev => ({
          ...prev,
          sections: {
            a: {
              ...prev.sections.a,
              chaptersToInclude: chapterNames.slice(0, 5)  // Default to first 5 chapters
            },
            b: {
              ...prev.sections.b,
              chaptersToInclude: chapterNames.slice(0, 5)  // Default to first 5 chapters
            }
          }
        }));
      }
      
      toast.success("Syllabus parsed successfully");
    } catch (error) {
      console.error("Error parsing syllabus:", error);
      toast.error("Failed to parse syllabus. Please check the format.");
    }
  };
  
  const generateBlueprint = () => {
    // This is a placeholder. In a real app, this would use AI to generate
    // questions based on the blueprint configuration
    const blueprintQuestions: Question[] = [];
    
    // For now, let's just demonstrate the structure with placeholder questions
    if (syllabus && syllabus.chapters.length > 0) {
      // Section A: one-mark questions
      const sectionAChapters = blueprintConfig.sections.a.chaptersToInclude;
      const chaptersToUse = syllabus.chapters.filter(c => 
        sectionAChapters.includes(c.name)
      );
      
      let questionCount = 1;
      
      // Generate one-mark questions
      chaptersToUse.forEach(chapter => {
        // Generate two questions per chapter for section A
        for (let i = 0; i < 2 && questionCount <= blueprintConfig.sections.a.oneMarkQuestionsCount; i++) {
          const topicIndex = Math.min(i, chapter.topics.length - 1);
          const topic = chapter.topics[topicIndex] || chapter.name;
          
          blueprintQuestions.push({
            id: `A${questionCount}`,
            topic,
            marks: 1,
            difficulty: blueprintConfig.difficulty,
            bloomLevel: "Remember",
            type: "Objective",
            content: `[Question ${questionCount}] Sample objective question about ${topic}?`,
            courseOutcome: "CO1",
            programOutcome: "PO1",
            chapter: chapter.name
          });
          
          questionCount++;
        }
      });
      
      // Reset question counter for Section B
      questionCount = 1;
      
      // Section B: descriptive questions with choice
      const sectionBChapters = blueprintConfig.sections.b.chaptersToInclude;
      const bChaptersToUse = syllabus.chapters.filter(c => 
        sectionBChapters.includes(c.name)
      );
      
      bChaptersToUse.forEach(chapter => {
        // Each question set has 2 internal choice questions
        for (let i = 0; i < blueprintConfig.sections.b.fiveMarkQuestionsPerChapter; i++) {
          const topicIndex = Math.min(i, chapter.topics.length - 1);
          const topic = chapter.topics[topicIndex] || chapter.name;
          const alternateTopicIndex = Math.min(i + 1, chapter.topics.length - 1);
          const alternateTopic = chapter.topics[alternateTopicIndex] || chapter.name;
          
          // Add the main question
          blueprintQuestions.push({
            id: `B${questionCount}a`,
            topic,
            marks: 5,
            difficulty: blueprintConfig.difficulty,
            bloomLevel: "Analyze",
            type: "Descriptive",
            content: `[Question ${questionCount}a] Explain in detail about ${topic}.`,
            courseOutcome: "CO3",
            programOutcome: "PO2",
            chapter: chapter.name
          });
          
          // Add the alternate choice
          blueprintQuestions.push({
            id: `B${questionCount}b`,
            topic: alternateTopic,
            marks: 5,
            difficulty: blueprintConfig.difficulty,
            bloomLevel: "Apply",
            type: "Descriptive",
            content: `[Question ${questionCount}b] Describe and analyze ${alternateTopic}.`,
            courseOutcome: "CO2",
            programOutcome: "PO3",
            chapter: chapter.name
          });
          
          questionCount++;
        }
      });
    }
    
    return blueprintQuestions;
  };
  
  const value: AppContextType = {
    questions,
    addQuestion,
    removeQuestion,
    clearQuestions,
    syllabus,
    setSyllabus,
    parseSyllabusFromText,
    blueprintConfig,
    setBlueprintConfig,
    generateBlueprint,
    isGenerating,
    setIsGenerating
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
