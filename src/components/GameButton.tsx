import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "level1" | "level2" | "level3" | "reward";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-primary hover:shadow-soft transform hover:scale-105 transition-all duration-300 text-primary-foreground font-bold",
      secondary: "bg-gradient-secondary hover:shadow-soft transform hover:scale-105 transition-all duration-300 text-secondary-foreground font-bold",
      success: "bg-gradient-success hover:shadow-success transform hover:scale-105 transition-all duration-300 text-success-foreground font-bold animate-bounce-in",
      level1: "bg-game-level1 hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 text-white font-bold shadow-game",
      level2: "bg-game-level2 hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 text-white font-bold shadow-game",
      level3: "bg-game-level3 hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 text-white font-bold shadow-game",
      reward: "bg-gradient-reward hover:shadow-success transform hover:scale-105 transition-all duration-300 text-warning-foreground font-bold animate-bounce-in"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-xl",
      xl: "px-12 py-6 text-xl rounded-2xl"
    };

    return (
      <Button
        ref={ref}
        className={cn(
          "border-0 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GameButton.displayName = "GameButton";

export { GameButton };