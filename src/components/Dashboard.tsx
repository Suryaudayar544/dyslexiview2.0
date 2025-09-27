import { GameButton } from "./GameButton";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Volume2, Eye, PenTool, Upload } from "lucide-react";

interface DashboardProps {
  username: string;
  onStartGame: (level: 1 | 2 | 3) => void;
  onFileUpload: () => void;
  onLogout: () => void;
  userProgress: {
    level1Score: number;
    level2Score: number;
    level3Score: number;
    totalStars: number;
    gamesPlayed: number;
  };
}

export const Dashboard = ({ username, onStartGame, onFileUpload, onLogout, userProgress }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-game p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {username}! 👋
            </h1>
          </div>
          <GameButton variant="secondary" size="sm" onClick={onLogout}>
            Logout
          </GameButton>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8 shadow-game">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-8 h-8 text-reward-gold" />
            <h2 className="text-2xl font-bold">Your Progress</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-reward-gold fill-current" />
                <span className="text-2xl font-bold text-reward-gold">{userProgress.totalStars}</span>
              </div>
              <p className="text-muted-foreground">Total Stars</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {userProgress.gamesPlayed}
              </div>
              <p className="text-muted-foreground">Games Played</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-2">
                {Math.round((userProgress.level1Score + userProgress.level2Score + userProgress.level3Score) / 3)}%
              </div>
              <p className="text-muted-foreground">Average Score</p>
            </div>
          </div>
        </Card>

        {/* Game Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Level 1 */}
          <Card className="p-6 shadow-game hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-game-level1 rounded-xl flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Level 1: Word Listen</h3>
                <p className="text-muted-foreground">Listen and find the right word!</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Best Score</span>
                <Badge variant="secondary">{userProgress.level1Score}%</Badge>
              </div>
              <Progress value={userProgress.level1Score} className="h-2" />
            </div>
            
            <GameButton
              variant="level1"
              size="lg"
              className="w-full group-hover:scale-105 transition-transform"
              onClick={() => onStartGame(1)}
            >
              Start Level 1 🎧
            </GameButton>
          </Card>

          {/* Level 2 */}
          <Card className="p-6 shadow-game hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-game-level2 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Level 2: Color Challenge</h3>
                <p className="text-muted-foreground">Say the color, not the word!</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Best Score</span>
                <Badge variant="secondary">{userProgress.level2Score}%</Badge>
              </div>
              <Progress value={userProgress.level2Score} className="h-2" />
            </div>
            
            <GameButton
              variant="level2"
              size="lg"
              className="w-full group-hover:scale-105 transition-transform"
              onClick={() => onStartGame(2)}
            >
              Start Level 2 🎨
            </GameButton>
          </Card>

          {/* Level 3 */}
          <Card className="p-6 shadow-game hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-game-level3 rounded-xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Level 3: Write Letters</h3>
                <p className="text-muted-foreground">Practice writing alphabet letters!</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Best Score</span>
                <Badge variant="secondary">{userProgress.level3Score}%</Badge>
              </div>
              <Progress value={userProgress.level3Score} className="h-2" />
            </div>
            
            <GameButton
              variant="level3"
              size="lg"
              className="w-full group-hover:scale-105 transition-transform"
              onClick={() => onStartGame(3)}
            >
              Start Level 3 ✏️
            </GameButton>
          </Card>
        </div>

        {/* Reading Helper */}
        <Card className="p-6 mt-8 shadow-game hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Reading Helper</h3>
              <p className="text-muted-foreground">Upload images to extract and hear text read aloud</p>
            </div>
          </div>
          
          <GameButton
            variant="primary"
            size="lg"
            className="w-full group-hover:scale-105 transition-transform"
            onClick={onFileUpload}
          >
            Open Reading Helper 📖
          </GameButton>
        </Card>

        {/* Rewards Section */}
        {userProgress.totalStars > 0 && (
          <Card className="p-6 mt-8 shadow-game bg-gradient-reward">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Amazing Progress!</h3>
              <p className="text-white/90 text-lg">
                You've earned {userProgress.totalStars} stars! Keep up the great work!
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

