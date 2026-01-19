'use client';

interface PlayButtonProps {
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PlayButton({ onClick, className = '', size = 'lg' }: PlayButtonProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-full bg-foreground/90 hover:bg-foreground transition-all flex items-center justify-center group ${className}`}
      aria-label="Play video"
    >
      <svg
        className="w-1/3 h-1/3 text-background ml-1"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}
