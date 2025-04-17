
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
    
    // Section B generation logic
    const chaptersToUseB = syllabus.chapters.filter(c => 
      sectionBChapters.includes(c.name)
    );
    
    chaptersToUseB.forEach(chapter => {
      for (let i = 0; i < 2 && questionCount <= maxSectionBQuestionSets; i++) {
        const topicIndex = Math.min(i, chapter.topics.length - 1);
        const topic = chapter.topics[topicIndex] || chapter.name;
        const alternateTopicIndex = Math.min(i + 1, chapter.topics.length - 1);
        const alternateTopic = chapter.topics[alternateTopicIndex] || chapter.name;
        
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
