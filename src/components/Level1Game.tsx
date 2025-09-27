/// <reference lib="dom" />
import { useState, useEffect, useCallback } from "react";
import { GameButton } from "./GameButton";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Volume2, RotateCcw, Home, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

declare const window: any;

interface Level1GameProps {
  onGameComplete: (score: number, stars: number) => void;
  onBackToDashboard: () => void;
}

interface Question {
  correctWord: string;
  options: string[];
  audioText: string;
}

const QUESTIONS: Question[] = [
  {
    correctWord: "cat",
    options: ["cat", "bat", "hat", "rat"],
    audioText: "Find the word: cat"
  },
  {
    correctWord: "dog",
    options: ["dog", "frog", "log", "hog"],
    audioText: "Find the word: dog"
  },
  {
    correctWord: "sun",
    options: ["sun", "fun", "run", "bun"],
    audioText: "Find the word: sun"
  },
  {
    correctWord: "ball",
    options: ["ball", "call", "fall", "hall"],
    audioText: "Find the word: ball"
  },
  {
    correctWord: "fish",
    options: ["fish", "dish", "wish", "cash"],
    audioText: "Find the word: fish"
  },
  {
    correctWord: "tree",
    options: ["tree", "free", "knee", "bee"],
    audioText: "Find the word: tree"
  },
  {
    correctWord: "book",
    options: ["book", "look", "took", "hook"],
    audioText: "Find the word: book"
  },
  {
    correctWord: "house",
    options: ["house", "mouse", "horse", "noise"],
    audioText: "Find the word: house"
  }
];

export const Level1Game = ({ onGameComplete, onBackToDashboard }: Level1GameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const speakText = useCallback((text: string) => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      try {
        // @ts-ignore
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 1;
        window.speechSynthesis.cancel(); // Cancel any ongoing speech to avoid overlap
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Speech synthesis error:", error);
        toast.error("Audio playback error occurred.");
      }
    } else {
      toast.error("Speech synthesis not supported in this browser.");
    }
  }, []);

  const handlePlayAudio = () => {
    speakText(question.audioText);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const correct = answer === question.correctWord;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(prev => prev + 1);
      speakText("Correct! Well done!");
      toast.success("Great job! 🎉", {
        description: `You found the word "${question.correctWord}"!`
      });
    } else {
      speakText(`Not quite right. The correct word is ${question.correctWord}`);
      toast.error("Try again next time!", {
        description: `The correct word was "${question.correctWord}"`
      });
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        setGameCompleted(true);
        const finalScore = Math.round((correct ? score + 1 : score) / QUESTIONS.length * 100);
        const stars = finalScore >= 80 ? 3 : finalScore >= 60 ? 2 : finalScore >= 40 ? 1 : 0;
        setTimeout(() => onGameComplete(finalScore, stars), 1000);
      }
    }, 2000);
  };

  useEffect(() => {
    // Auto-play audio when question loads
    const timer = setTimeout(() => {
      handlePlayAudio();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentQuestion, handlePlayAudio]);

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
            You got {score} out of {QUESTIONS.length} words correct!
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
          <h1 className="text-2xl font-bold">Level 1: Word Listen 🎧</h1>
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
            <div className="mb-6">
              <GameButton
                variant="primary"
                size="xl"
                onClick={handlePlayAudio}
                className="animate-pulse"
              >
                <Volume2 className="w-8 h-8 mr-2" />
                Listen to the word
              </GameButton>
            </div>
            
            <p className="text-lg text-muted-foreground mb-6">
              Click the button above to hear the word, then select it from the options below:
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => {
              let buttonVariant: "primary" | "success" | "secondary" = "primary";
              let isDisabled = false;
              let icon = null;

              if (showFeedback && selectedAnswer) {
                if (option === question.correctWord) {
                  buttonVariant = "success";
                  icon = <CheckCircle className="w-6 h-6" />;
                } else if (option === selectedAnswer && option !== question.correctWord) {
                  buttonVariant = "secondary";
                  icon = <XCircle className="w-6 h-6" />;
                }
                isDisabled = true;
              }

              return (
                <GameButton
                  key={index}
                  variant={buttonVariant}
                  size="xl"
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isDisabled}
                  className={`text-2xl font-bold h-20 ${
                    showFeedback && option === selectedAnswer ? 'ring-4 ring-white' : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {option}
                    {icon}
                  </span>
                </GameButton>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mt-6 text-center">
              <p className={`text-xl font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                {isCorrect ? '🎉 Correct!' : `❌ The word was "${question.correctWord}"`}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
