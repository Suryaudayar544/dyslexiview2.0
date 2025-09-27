import { useState } from "react";
import { GameButton } from "./GameButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginProps {
  onLogin: (username: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-game flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-game animate-bounce-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Word Wonder
          </h1>
          <p className="text-muted-foreground text-lg">
            Fun learning games for smart kids! 🌟
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-lg font-semibold">
              What's your name?
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your name here..."
              value={username}
              // --- FIX: Explicitly type the event 'e' ---
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="text-lg py-3 rounded-xl border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          
          <GameButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
          >
            Let's Play! 🎮
          </GameButton>
        </form>
      </Card>
    </div>
  );
}; 