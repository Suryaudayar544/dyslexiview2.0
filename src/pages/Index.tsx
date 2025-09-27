import { Login } from "@/components/Login";
import { Dashboard } from "@/components/Dashboard";
import { Level1Game } from "@/components/Level1Game";
import { Level2Game } from "@/components/Level2Game";
import { Level3Game } from "@/components/Level3Game";
import { FileUpload } from "@/components/FileUpload";
import { useGameState } from "@/hooks/useGameState";
import { useState } from "react";

type GameState = "login" | "dashboard" | "level1" | "level2" | "level3" | "fileupload";

const Index = () => {
  const { currentUser, userProgress, login, logout, updateProgress } = useGameState();
  const [gameState, setGameState] = useState<GameState>("login");

  // Auto-navigate based on login status
  const handleLogin = (username: string) => {
    login(username);
    setGameState("dashboard");
  };

  const handleLogout = () => {
    logout();
    setGameState("login");
  };

  const handleStartGame = (level: 1 | 2 | 3) => {
    if (level === 1) setGameState("level1");
    else if (level === 2) setGameState("level2");
    else if (level === 3) setGameState("level3");
  };

  const handleFileUpload = () => {
    setGameState("fileupload");
  };

  const handleGameComplete = (score: number, stars: number, level: 1 | 2 | 3) => {
    updateProgress(level, score, stars);
    setGameState("dashboard");
  };

  const handleBackToDashboard = () => {
    setGameState("dashboard");
  };

  // Show login if no user
  if (!currentUser || gameState === "login") {
    return <Login onLogin={handleLogin} />;
  }

  // Show appropriate game state
  switch (gameState) {
    case "dashboard":
      return (
        <Dashboard
          username={currentUser}
          onStartGame={handleStartGame}
          onFileUpload={handleFileUpload}
          onLogout={handleLogout}
          userProgress={userProgress}
        />
      );
    case "level1":
      return (
        <Level1Game
          onGameComplete={(score, stars) => handleGameComplete(score, stars, 1)}
          onBackToDashboard={handleBackToDashboard}
        />
      );
    case "level2":
      return (
        <Level2Game
          onGameComplete={(score, stars) => handleGameComplete(score, stars, 2)}
          onBackToDashboard={handleBackToDashboard}
        />
      );
    case "level3":
      return (
        <Level3Game
          onGameComplete={(score, stars) => handleGameComplete(score, stars, 3)}
          onBackToDashboard={handleBackToDashboard}
        />
      );
    case "fileupload":
      return (
        <FileUpload
          onBack={handleBackToDashboard}
        />
      );
    default:
      return (
        <Dashboard
          username={currentUser}
          onStartGame={handleStartGame}
          onFileUpload={handleFileUpload}
          onLogout={handleLogout}
          userProgress={userProgress}
        />
      );
  }
};

export default Index;
