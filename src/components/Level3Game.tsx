import { useState, useRef, useEffect, useCallback } from "react";
import { GameButton } from "./GameButton";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// --- IMPORTANT ---
// 1. Replace this with your actual Google Cloud API Key.
// 2. Make sure you have RESTRICTED this key in your Google Cloud Console!
const GOOGLE_CLOUD_API_KEY = 'AIzaSyAIZEHaxJT1FQi61u_TClh9Zje4L9TPPm8';
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`;


interface Level3GameProps {
  onGameComplete: (score: number, stars: number) => void;
  onBackToDashboard: () => void;
}

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const Level3Game = ({ onGameComplete, onBackToDashboard }: Level3GameProps) => {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [score, setScore] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(false); // State to handle API loading
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctxRef.current = ctx;
        initializeCanvas();
      }
    }
  }, []);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const getEventCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] : null;
    return {
      x: touch ? touch.clientX - rect.left : (e as React.MouseEvent).clientX - rect.left,
      y: touch ? touch.clientY - rect.top : (e as React.MouseEvent).clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = ctxRef.current;
    if (!ctx) return;

    const { x, y } = getEventCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 12; // You can adjust this for better recognition
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  }, [getEventCoordinates]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    if (!ctx) return;

    const { x, y } = getEventCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, getEventCoordinates]);

  const stopDrawing = useCallback(() => setIsDrawing(false), []);

  const clearCanvas = () => {
    initializeCanvas();
  };
  
  // This function now calls the Google Cloud Vision API
  const evaluateDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Check if canvas is empty (all white pixels)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (imageData.data.every((value, index) => index % 4 === 3 || value === 255)) {
      toast.error("Canvas is empty", { description: "Please draw the letter before checking." });
      return;
    }

    setIsChecking(true);

    // Get the image data from the canvas as a Base64 string
    const base64ImageData = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, "");

    const requestBody = {
      requests: [
        {
          image: {
            content: base64ImageData,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(GOOGLE_VISION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Google Cloud Vision API Error:", errorData);
        toast.error("API Error", { description: "Could not check handwriting. Check console for details." });
        return;
      }

      const data = await response.json();
      const detection = data.responses[0]?.textAnnotations?.[0]?.description || data.responses[0]?.fullTextAnnotation?.text;
      const detectedLetter = detection?.trim().toUpperCase()?.[0];  // Take first character

      console.log(`Google Vision predicts: ${detectedLetter}, expecting: ${alphabet[currentLetter]}`);
      
      if (detectedLetter === alphabet[currentLetter]) {
        toast.success("Excellent!", { description: `You drew the letter ${alphabet[currentLetter]} correctly!` });
        const newScore = score + 100;
        setScore(newScore);

        if (currentLetter < alphabet.length - 1) {
          setTimeout(() => setCurrentLetter(prev => prev + 1), 1500);
        } else {
          setGameComplete(true);
          const stars = Math.floor(newScore / 300) + 1;
          setTimeout(() => onGameComplete(newScore, Math.min(stars, 3)), 1500);
        }
      } else {
        toast.error("Not quite", { description: `That looks like a ${detectedLetter || 'different letter'}. Try again!` });
      }
    } catch (error) {
      console.error("Error calling Vision API:", error);
      toast.error("Network Error", { description: "Failed to connect to the handwriting recognition service." });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(clearCanvas, [currentLetter]);

  if (gameComplete) {
    const stars = Math.floor(score / 300) + 1;
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-primary mb-4">Level Complete! 🎉</h2>
          <div className="mb-6">
            <p className="text-xl mb-2">Final Score: {score}</p>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={`text-3xl ${i < Math.min(stars, 3) ? 'text-yellow-400' : 'text-gray-300'}`}>⭐</span>
              ))}
            </div>
          </div>
          <GameButton variant="primary" size="lg" onClick={onBackToDashboard} className="w-full">
            Back to Dashboard
          </GameButton>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <GameButton variant="secondary" onClick={onBackToDashboard}>← Back</GameButton>
          <div className="text-right"><p className="text-lg font-semibold">Score: {score}</p></div>
        </div>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Progress</span>
            <span>{currentLetter + 1} / {alphabet.length}</span>
          </div>
          <Progress value={((currentLetter + 1) / alphabet.length) * 100} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-8 text-center flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Draw this letter:</h2>
            <div className="text-9xl font-bold text-primary mb-4 font-mono">{alphabet[currentLetter]}</div>
          </Card>
          <Card className="p-6">
            <div className="border-2 border-dashed bg-gray-50 rounded-lg p-2 mb-4 touch-none">
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="w-full h-auto rounded cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex gap-2">
              <GameButton variant="secondary" onClick={clearCanvas} className="flex-1">Clear</GameButton>
              <GameButton variant="success" onClick={evaluateDrawing} className="flex-1" disabled={isChecking}>
                {isChecking ? 'Checking...' : 'Check ✓'}
              </GameButton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};