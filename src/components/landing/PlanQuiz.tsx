import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  description: string;
  options: {
    value: string;
    label: string;
    description: string;
  }[];
}

interface PlanQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelected: (planName: string) => void;
}

const questions: QuizQuestion[] = [
  {
    id: "business-size",
    question: "What's the size of your business?",
    description: "Help us understand your current operation scale",
    options: [
      {
        value: "small",
        label: "Small Family Business",
        description: "1-2 locations, family-operated"
      },
      {
        value: "medium",
        label: "Growing Business",
        description: "3-5 locations, some employees"
      },
      {
        value: "large",
        label: "Established Chain",
        description: "6+ locations, multiple staff"
      }
    ]
  },
  {
    id: "order-volume",
    question: "How many orders do you process weekly?",
    description: "This helps us recommend the right capacity",
    options: [
      {
        value: "low",
        label: "Under 100 orders",
        description: "Starting or very small volume"
      },
      {
        value: "medium",
        label: "100-500 orders",
        description: "Steady local customer base"
      },
      {
        value: "high",
        label: "500+ orders",
        description: "High volume, multiple channels"
      }
    ]
  },
  {
    id: "team-size",
    question: "How many team members work with orders?",
    description: "Including family members who help with the business",
    options: [
      {
        value: "solo",
        label: "Just me or my family",
        description: "1-2 people handling everything"
      },
      {
        value: "small-team",
        label: "Small team",
        description: "3-10 people"
      },
      {
        value: "large-team",
        label: "Large team",
        description: "10+ people across locations"
      }
    ]
  },
  {
    id: "preferred-channel",
    question: "How do your customers prefer to order?",
    description: "Understanding your customer communication preferences",
    options: [
      {
        value: "whatsapp",
        label: "WhatsApp mainly",
        description: "Most customers use WhatsApp"
      },
      {
        value: "mixed",
        label: "Multiple channels",
        description: "WhatsApp, Instagram, phone calls"
      },
      {
        value: "digital",
        label: "Online platforms",
        description: "Website, apps, social media"
      }
    ]
  }
];

const calculateRecommendedPlan = (answers: Record<string, string>): string => {
  let score = 0;
  
  // Business size scoring
  if (answers["business-size"] === "medium") score += 1;
  if (answers["business-size"] === "large") score += 2;
  
  // Order volume scoring
  if (answers["order-volume"] === "medium") score += 1;
  if (answers["order-volume"] === "high") score += 2;
  
  // Team size scoring
  if (answers["team-size"] === "small-team") score += 1;
  if (answers["team-size"] === "large-team") score += 2;
  
  // Channel preference scoring
  if (answers["preferred-channel"] === "mixed") score += 1;
  if (answers["preferred-channel"] === "digital") score += 2;
  
  if (score <= 2) return "Starter";
  if (score <= 5) return "Growth";
  return "Pro";
};

export function PlanQuiz({ isOpen, onClose, onPlanSelected }: PlanQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = answers[questions[currentQuestion]?.id];

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSelectPlan = () => {
    const recommendedPlan = calculateRecommendedPlan(answers);
    onPlanSelected(recommendedPlan);
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    const recommendedPlan = calculateRecommendedPlan(answers);
    
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Your Recommended Plan</DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary mb-2">{recommendedPlan}</div>
              <p className="text-muted-foreground">
                Based on your answers, this plan is perfect for your business needs
              </p>
            </div>
            
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Why {recommendedPlan}?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-left space-y-2 text-sm">
                  {recommendedPlan === "Starter" && (
                    <>
                      <p>• Perfect for small family businesses getting started</p>
                      <p>• Essential features to launch your digital presence</p>
                      <p>• WhatsApp integration for easy customer communication</p>
                    </>
                  )}
                  {recommendedPlan === "Growth" && (
                    <>
                      <p>• Ideal for growing businesses with steady order volume</p>
                      <p>• Advanced features like gamification and analytics</p>
                      <p>• Multi-channel support for diverse customer preferences</p>
                    </>
                  )}
                  {recommendedPlan === "Pro" && (
                    <>
                      <p>• Enterprise solution for established food chains</p>
                      <p>• Advanced customization and white-label options</p>
                      <p>• Dedicated support for high-volume operations</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={reset}>
                Take Quiz Again
              </Button>
              <Button className="btn-brazil" onClick={handleSelectPlan}>
                Get Started with {recommendedPlan}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Find Your Perfect Plan</DialogTitle>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>
        
        {questions[currentQuestion] && (
          <div className="py-6">
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-2">
                {questions[currentQuestion].question}
              </h3>
              <p className="text-muted-foreground">
                {questions[currentQuestion].description}
              </p>
            </div>
            
            <RadioGroup
              value={answers[questions[currentQuestion].id] || ""}
              onValueChange={handleAnswer}
              className="space-y-4"
            >
              {questions[currentQuestion].options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={option.value} 
                    id={option.value}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor={option.value} 
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!canProceed}
            className="btn-brazil"
          >
            {isLastQuestion ? "Get My Recommendation" : "Next"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}