"use client";

import { type MouseEvent as ReactMouseEvent, type ReactNode, useState } from "react";

type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  compact?: boolean;
  manager?: boolean;
};

export default function FlipCard({ front, back, className = "", compact = false, manager = false }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a, button, input, textarea, select")) {
      return;
    }
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className={`flip-card group ${manager ? "flip-card--manager" : ""} ${isFlipped ? "flip-card--flipped" : ""} ${className}`}
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
    >
      <div className={`flip-card__inner ${compact ? "flip-card__inner--compact" : ""}`}>
        <div className="flip-card__face flip-card__front">{front}</div>
        <div className="flip-card__face flip-card__back">{back}</div>
      </div>
    </div>
  );
}
