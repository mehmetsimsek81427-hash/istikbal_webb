"use client";

import { useState, type ReactNode } from "react";

type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  compact?: boolean;
  manager?: boolean;
};

export default function FlipCard({ front, back, className = "", compact = false, manager = false }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flip-card group ${manager ? "flip-card--manager" : ""} ${isFlipped ? "flip-card--flipped" : ""} ${className}`}
      onClick={() => setIsFlipped((prev) => !prev)}
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
