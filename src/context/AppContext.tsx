
import React, { createContext, useContext, useState } from 'react';

// Define types
export type Difficulty = "Easy" | "Medium" | "Hard";
export type BloomLevel = "Remember" | "Understand" | "Apply" | "Analyze" | "Evaluate" | "Create";
export type QuestionType = "Objective" | "Descriptive" | "Fill in the Blanks" | "True/False" | "E-marks";

export interface Topic {
  name: string;
}

export interface Chapter {
  name: string;
  topics: Topic[];
}

export interface SyllabusMeta {
  course: string;
  code?: string;
  department?: string;
  semester?: string;
  year?: string;
  description?: string;
}

export interface Syllabus {
  meta: SyllabusMeta;
  chapters: Chapter[];
}

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

export interface BlueprintConfig {
  paperTitle: string;
  maxMarks: number;
  time: number;
  difficulty: Difficulty;
  numberOfQuestions: {
    sectionA: number;
    sectionB: number;
  };
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

// Create the context
interface AppContextProps {
  syllabus: Syllabus | null;
  setSyllabus: React.Dispatch<React.SetStateAction<Syllabus | null>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  blueprintConfig: BlueprintConfig;
  setBlueprintConfig: React.Dispatch<React.SetStateAction<BlueprintConfig>>;
  parseSyllabusFromText: (text: string) => void;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  generateBlueprint: () => Question[];
  clearQuestions: () => void;
}

const AppContext = createContext<AppContextProps | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [blueprintConfig, setBlueprintConfig] = useState<BlueprintConfig>({
    paperTitle: "End Semester Examination",
    maxMarks: 100,
    time: 180,
    difficulty: "Medium",
    numberOfQuestions: {
      sectionA: 10,
      sectionB: 5
    },
    sections: {
      a: {
        oneMarkQuestionsCount: 10,
        chaptersToInclude: [],
      },
      b: {
        fiveMarkQuestionsPerChapter: 1,
        chaptersToInclude: [],
      }
    }
  });

  // Clear all questions
  const clearQuestions = () => {
    setQuestions([]);
  };

  // Parse syllabus from text
  const parseSyllabusFromText = (text: string) => {
    // Very basic parsing for now - this would be more sophisticated in a real app
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Extract course name from first non-empty line
    const courseName = lines[0] || "Unknown Course";
    
    // Basic chapter extraction
    const chapters: Chapter[] = [];
    let currentChapter: Chapter | null = null;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.toUpperCase().includes('UNIT') || line.toUpperCase().includes('MODULE') || line.toUpperCase().includes('CHAPTER')) {
        // This is likely a chapter heading
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        currentChapter = { name: line, topics: [] };
      } else if (currentChapter && line.length > 5) {
        // Assume this is a topic if not too short
        currentChapter.topics.push({ name: line });
      }
    }
    
    // Add the final chapter
    if (currentChapter) {
      chapters.push(currentChapter);
    }
    
    // Create syllabus object
    const newSyllabus: Syllabus = {
      meta: { course: courseName },
      chapters: chapters
    };
    
    // Update state
    setSyllabus(newSyllabus);
    
    // Update blueprint config with all chapters
    setBlueprintConfig(prev => ({
      ...prev,
      sections: {
        a: {
          ...prev.sections.a,
          chaptersToInclude: chapters.map(c => c.name)
        },
        b: {
          ...prev.sections.b,
          chaptersToInclude: chapters.map(c => c.name)
        }
      }
    }));
  };

  // Generate blueprint function
  const generateBlueprint = () => {
    const blueprintQuestions: Question[] = [];
    
    if (syllabus && syllabus.chapters.length > 0) {
      const sectionAChapters = blueprintConfig.sections.a.chaptersToInclude;
      const sectionBChapters = blueprintConfig.sections.b.chaptersToInclude;
      
      let questionCount = 1;
      const maxSectionAQuestions = blueprintConfig.numberOfQuestions.sectionA;
      const maxSectionBQuestionSets = blueprintConfig.numberOfQuestions.sectionB;
      
      // Section A generation logic
      const chaptersToUseA = syllabus.chapters.filter(c => 
        sectionAChapters.includes(c.name)
      );
      
      // Generate Section A questions
      chaptersToUseA.forEach(chapter => {
        for (let i = 0; i < 2 && questionCount <= maxSectionAQuestions; i++) {
          const topicIndex = Math.min(i, chapter.topics.length - 1);
          const topic = chapter.topics[topicIndex]?.name || chapter.name;
          
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
      
      // Section B generation logic
      const chaptersToUseB = syllabus.chapters.filter(c => 
        sectionBChapters.includes(c.name)
      );
      
      chaptersToUseB.forEach(chapter => {
        for (let i = 0; i < 2 && questionCount <= maxSectionBQuestionSets; i++) {
          const topicIndex = Math.min(i, chapter.topics.length - 1);
          const topic = chapter.topics[topicIndex]?.name || chapter.name;
          const alternateTopicIndex = Math.min(i + 1, chapter.topics.length - 1);
          const alternateTopic = chapter.topics[alternateTopicIndex]?.name || chapter.name;
          
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

  const value = {
    syllabus,
    setSyllabus,
    questions,
    setQuestions,
    blueprintConfig,
    setBlueprintConfig,
    parseSyllabusFromText,
    isGenerating,
    setIsGenerating,
    generateBlueprint,
    clearQuestions
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
