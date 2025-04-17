import { Question, Difficulty, BloomLevel, QuestionType } from "@/context/AppContext";
import { toast } from "sonner";

// This is a mock API service that simulates generating questions using AI
// In a real application, this would make API calls to an actual backend

const mockQuestionGeneration = (
  topic: string,
  marks: number,
  difficulty: Difficulty,
  bloomLevel: BloomLevel,
  type: QuestionType
): Promise<Question> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a unique ID
      const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Map difficulty to CO/PO numbers for this example
      const coDifficulty = { "Easy": "1", "Medium": "2", "Hard": "3" };
      const poBloom = { 
        "Remember": "1", "Understand": "2", "Apply": "3", 
        "Analyze": "4", "Evaluate": "5", "Create": "6" 
      };
      
      // Generate content based on parameters
      let content = "";
      
      switch(type) {
        case "Objective":
          const options = ["A", "B", "C", "D"];
          content = `Question about ${topic} (${difficulty} difficulty, ${bloomLevel} level):\n\n`;
          content += `Which of the following best describes ${topic}?\n\n`;
          options.forEach(opt => {
            content += `${opt}) Sample option text for ${topic}\n`;
          });
          break;
          
        case "Descriptive":
          content = `${difficulty} level ${bloomLevel} question about ${topic}:\n\n`;
          
          if (marks === 1) {
            content += `Briefly define ${topic}.`;
          } else if (marks === 2) {
            content += `Explain the concept of ${topic} with a simple example.`;
          } else if (marks === 3) {
            content += `Describe ${topic} and explain its importance in the field with examples.`;
          } else {
            content += `Provide a detailed analysis of ${topic}, discussing its principles, applications, and limitations in engineering contexts. Illustrate with relevant examples and diagrams where appropriate.`;
          }
          break;
          
        case "Fill in the Blanks":
          content = `${difficulty} level ${bloomLevel} fill in the blanks question:\n\n`;
          content += `In the context of ${topic}, _____________ is a fundamental concept that relates to _____________.`;
          break;
          
        case "True/False":
          content = `${difficulty} level ${bloomLevel} true/false question:\n\n`;
          content += `State whether the following statement is TRUE or FALSE and justify your answer:\n\n`;
          content += `"${topic} is primarily used for optimization in most engineering applications."`;
          break;
          
        case "E-marks":
          content = `${difficulty} level ${bloomLevel} e-marks question about ${topic}:\n\n`;
          content += `Consider the following scenario related to ${topic} and solve all parts:\n\n`;
          if (marks === 3) {
            content += `a) Define ${topic} and explain its significance. (1 mark)\n`;
            content += `b) Analyze how ${topic} is applied in a practical scenario. (1 mark)\n`;
            content += `c) Evaluate the effectiveness of ${topic} in solving problems. (1 mark)\n`;
          } else {
            content += `a) Define ${topic} and explain its significance. (2 marks)\n`;
            content += `b) Analyze how ${topic} is applied in a practical scenario. (2 marks)\n`;
            content += `c) Evaluate the effectiveness of ${topic} in solving complex problems. (2 marks)\n`;
          }
          break;
          
        default:
          content = `Question about ${topic} (${difficulty} difficulty, ${bloomLevel} level)`;
      }
      
      // Create and return question object
      resolve({
        id,
        topic,
        marks,
        difficulty,
        bloomLevel,
        type,
        content,
        courseOutcome: `CO${coDifficulty[difficulty] || "1"}`,
        programOutcome: `PO${poBloom[bloomLevel] || "1"}`,
      });
    }, 1000); // Simulate 1 second API delay
  });
};

const parseFiles = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        resolve(event.target.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

export const ApiService = {
  // Generate a question using AI
  generateQuestion: async (
    topic: string,
    marks: number,
    difficulty: Difficulty,
    bloomLevel: BloomLevel,
    type: QuestionType
  ): Promise<Question | null> => {
    try {
      // In a real application, this would be an API call to your backend
      return await mockQuestionGeneration(topic, marks, difficulty, bloomLevel, type);
    } catch (error) {
      console.error("Error generating question:", error);
      toast.error("Failed to generate question. Please try again.");
      return null;
    }
  },
  
  // Parse uploaded syllabus file
  parseSyllabusFile: async (file: File): Promise<string> => {
    try {
      return await parseFiles(file);
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error("Failed to parse file. Please check the format.");
      throw error;
    }
  },
  
  // Export questions to PDF (mock implementation)
  exportToPdf: (questions: Question[], title: string): void => {
    // This would typically use a library like jsPDF or call a backend API
    // For now, we'll just show a success toast
    toast.success(`${title} would be exported as PDF in a real application`);
    console.log("Questions to export:", questions);
  }
};
