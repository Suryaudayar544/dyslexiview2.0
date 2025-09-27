import { useState, useEffect } from 'react';

export interface UserProgress {
  level1Score: number;
  level2Score: number;
  level3Score: number;
  totalStars: number;
  gamesPlayed: number;
}

export const useGameState = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level1Score: 0,
    level2Score: 0,
    level3Score: 0,
    totalStars: 0,
    gamesPlayed: 0
  });

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('wordWonderUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      const savedProgress = localStorage.getItem(`wordWonderProgress_${savedUser}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
    }
  }, []);

  // Save user data to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wordWonderUser', currentUser);
      localStorage.setItem(`wordWonderProgress_${currentUser}`, JSON.stringify(userProgress));
    }
  }, [currentUser, userProgress]);

  const login = (username: string) => {
    setCurrentUser(username);
    const savedProgress = localStorage.getItem(`wordWonderProgress_${username}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    } else {
      setUserProgress({
        level1Score: 0,
        level2Score: 0,
        level3Score: 0,
        totalStars: 0,
        gamesPlayed: 0
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserProgress({
      level1Score: 0,
      level2Score: 0,
      level3Score: 0,
      totalStars: 0,
      gamesPlayed: 0
    });
  };

  const updateProgress = (level: 1 | 2 | 3, score: number, stars: number) => {
    setUserProgress(prev => {
      const newProgress = { ...prev };
      
      if (level === 1) {
        newProgress.level1Score = Math.max(newProgress.level1Score, score);
      } else if (level === 2) {
        newProgress.level2Score = Math.max(newProgress.level2Score, score);
      } else if (level === 3) {
        newProgress.level3Score = Math.max(newProgress.level3Score, score);
      }
      
      newProgress.totalStars += stars;
      newProgress.gamesPlayed += 1;
      
      return newProgress;
    });
  };

  return {
    currentUser,
    userProgress,
    login,
    logout,
    updateProgress
  };
};