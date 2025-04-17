
import { Question } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RefreshCw, Trash } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  onDelete?: (id: string) => void;
  onRegenerate?: (question: Question) => void;
  showActions?: boolean;
  isAlternate?: boolean;
}

export function QuestionCard({ 
  question, 
  onDelete, 
  onRegenerate, 
  showActions = true,
  isAlternate = false
}: QuestionCardProps) {
  const { 
    id, 
    content, 
    topic, 
    marks, 
    difficulty, 
    bloomLevel, 
    type, 
    courseOutcome, 
    programOutcome,
    chapter
  } = question;

  // Custom colors based on difficulty
  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  };

  // Custom colors based on bloom's level
  const bloomColor = {
    Remember: "bg-blue-100 text-blue-800",
    Understand: "bg-indigo-100 text-indigo-800",
    Apply: "bg-purple-100 text-purple-800",
    Analyze: "bg-pink-100 text-pink-800",
    Evaluate: "bg-orange-100 text-orange-800",
    Create: "bg-cyan-100 text-cyan-800",
  };

  return (
    <Card className={`overflow-hidden ${isAlternate ? 'border-dashed' : ''}`}>
      <CardHeader className="bg-muted/50 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{type}</Badge>
            <Badge className={difficultyColor[difficulty]}>{difficulty}</Badge>
            <Badge className={bloomColor[bloomLevel]}>{bloomLevel}</Badge>
            <Badge variant="secondary">{marks} mark{marks > 1 ? 's' : ''}</Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{courseOutcome}</span>
            <span>•</span>
            <span>{programOutcome}</span>
          </div>
        </div>
        
        {topic && (
          <div className="mt-1 text-sm font-medium">
            Topic: {topic}
            {chapter && <span className="ml-2 text-xs text-muted-foreground">({chapter})</span>}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="whitespace-pre-line text-sm">{content}</div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-end gap-2 border-t bg-muted/30 py-2">
          {onRegenerate && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRegenerate(question)}
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Regenerate
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(id)}
            >
              <Trash className="mr-2 h-3.5 w-3.5" />
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
