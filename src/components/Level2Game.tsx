
declare const window: any;

import { useState, useEffect, useCallback } from "react";
import { GameButton } from "./GameButton";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mic, Home, CheckCircle, XCircle, MicOff } from "lucide-react";
import { toast } from "sonner";

interface Level2GameProps {
  onGameComplete: (score: number, stars: number) => void;
  onBackToDashboard: () => void;
}

interface ColorQuestion {
  displayColor: string;
  displayText: string;
  correctAnswer: string;
}

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  purple: '#a855f7',
  orange: '#f97316'
};

const generateQuestion = (): ColorQuestion => {
  const displayColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  let displayText = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  // Ensure text and color are different for challenge
  while (displayText === displayColor) {
    displayText = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  
  return {
    displayColor,
    displayText,
    correctAnswer: displayColor
  };
};

const QUESTIONS = Array.from({ length: 8 }, () => generateQuestion());

export const Level2Game = ({ onGameComplete, onBackToDashboard }: Level2GameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lastSpokenWord, setLastSpokenWord] = useState<string>("");
  const [gameCompleted, setGameCompleted] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const speakText = useCallback((text: string) => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      // @ts-ignore
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.toLowerCase().trim();
        setLastSpokenWord(spokenWord);
        handleAnswer(spokenWord);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error("Couldn't hear you clearly. Try again!");
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast.error("Speech recognition not supported in this browser");
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening && !showFeedback) {
      setIsListening(true);
      recognition.start();
      toast.info("Listening... Say the COLOR you see!", {
        description: "Not the word, but the actual color!"
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleAnswer = (spokenWord: string) => {
    if (showFeedback) return;

    const correct = spokenWord === question.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prev => prev + 1);
      speakText("Excellent! You said the correct color!");
      toast.success("Perfect! 🎉", {
        description: `You correctly said "${question.correctAnswer}"!`
      });
    } else {
      speakText(`Not quite right. The color you should say is ${question.correctAnswer}`);
      toast.error("Try again next time!", {
        description: `You said "${spokenWord}" but the color was "${question.correctAnswer}"`
      });
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setShowFeedback(false);
        setLastSpokenWord("");
      } else {
        setGameCompleted(true);
        const finalScore = Math.round((correct ? score + 1 : score) / QUESTIONS.length * 100);
        const stars = finalScore >= 80 ? 3 : finalScore >= 60 ? 2 : finalScore >= 40 ? 1 : 0;
        setTimeout(() => onGameComplete(finalScore, stars), 1000);
      }
    }, 3000);
  };

  // Manual answer buttons as fallback
  const handleManualAnswer = (color: string) => {
    if (showFeedback) return;
    handleAnswer(color);
  };

  useEffect(() => {
    // Give instructions when question loads
    const timer = setTimeout(() => {
      speakText(`Say the color you see, not the word. Look carefully at the color.`);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentQuestion, speakText]);

  if (gameCompleted) {
    const finalScore = Math.round(score / QUESTIONS.length * 100);
    const stars = finalScore >= 80 ? 3 : finalScore >= 60 ? 2 : finalScore >= 40 ? 1 : 0;
    
    return (
      <div className="min-h-screen bg-gradient-game flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-game animate-bounce-in">
          <div className="text-6xl mb-4">
            {stars >= 3 ? "🏆" : stars >= 2 ? "🥈" : stars >= 1 ? "🥉" : "👍"}
          </div>
          <h2 className="text-3xl font-bold mb-2">Level Complete!</h2>
          <p className="text-xl text-muted-foreground mb-4">
            Score: {finalScore}%
          </p>
          <p className="text-lg mb-6">
            You got {score} out of {QUESTIONS.length} colors correct!
          </p>
          <div className="space-y-4">
            <GameButton
              variant="success"
              size="lg"
              className="w-full"
              onClick={onBackToDashboard}
            >
              Back to Dashboard 🏠
            </GameButton>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-game p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Level 2: Color Challenge 🎨</h1>
          <GameButton variant="secondary" size="sm" onClick={onBackToDashboard}>
            <Home className="w-4 h-4" />
          </GameButton>
        </div>

        {/* Progress */}
        <Card className="p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Progress</span>
            <Badge variant="secondary">
              {currentQuestion + 1} / {QUESTIONS.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-3" />
        </Card>

        {/* Game Area */}
        <Card className="p-8 shadow-game">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-4">
              Say the COLOR you see, not the word! 🧠
            </h3>
            
            {/* Color Display */}
            <div className="mb-8">
              <div 
                className="w-48 h-48 mx-auto rounded-3xl shadow-lg flex items-center justify-center text-4xl font-black border-4 border-white"
                style={{ backgroundColor: COLOR_MAP[question.displayColor] }}
              >
                <span className="text-white drop-shadow-lg">
                  {question.displayText.toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-6">
              The box shows "{question.displayText}" but what COLOR is the box?
            </p>
          </div>

          {/* Voice Input */}
          <div className="text-center mb-6">
            <GameButton
              variant={isListening ? "success" : "primary"}
              size="xl"
              onClick={isListening ? stopListening : startListening}
              disabled={showFeedback}
              className={isListening ? "animate-pulse" : ""}
            >
              {isListening ? (
                <>
                  <Mic className="w-8 h-8 mr-2" />
                  Listening...
                </>
              ) : (
                <>
                  <MicOff className="w-8 h-8 mr-2" />
                  Tap to Speak
                </>
              )}
            </GameButton>
          </div>

          {/* Manual Answer Buttons (Fallback) */}
          <div className="mb-6">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Or tap the correct color:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map((color) => {
                let buttonVariant: "primary" | "success" | "secondary" = "primary";
                let icon = null;

                if (showFeedback) {
                  if (color === question.correctAnswer) {
                    buttonVariant = "success";
                    icon = <CheckCircle className="w-4 h-4" />;
                  } else if (color === lastSpokenWord && color !== question.correctAnswer) {
                    buttonVariant = "secondary";
                    icon = <XCircle className="w-4 h-4" />;
                  }
                }

                return (
                  <GameButton
                    key={color}
                    variant={buttonVariant}
                    size="md"
                    onClick={() => handleManualAnswer(color)}
                    disabled={showFeedback}
                    className="capitalize"
                  >
                    <span className="flex items-center gap-1">
                      {color}
                      {icon}
                    </span>
                  </GameButton>
                );
              })}
            </div>
          </div>

          {showFeedback && (
            <div className="text-center">
              <p className={`text-xl font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                {isCorrect 
                  ? '🎉 Perfect! You said the right color!' 
                  : `❌ You said "${lastSpokenWord}" but the color was "${question.correctAnswer}"`
                }
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};