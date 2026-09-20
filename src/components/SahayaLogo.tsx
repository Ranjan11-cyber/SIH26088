import React from 'react';

interface SahayaLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'svg' | 'image';
  withBadge?: boolean;
  badgeClassName?: string;
  alt?: string;
}

export const SahayaLogo: React.FC<SahayaLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'svg',
  withBadge = false,
  badgeClassName = '',
  alt = 'Sahaya Logo'
}) => {
  const getDimensions = () => {
    if (typeof size === 'number') return { width: size, height: size };
    switch (size) {
      case 'xs': return { width: 20, height: 20 };
      case 'sm': return { width: 28, height: 28 };
      case 'md': return { width: 36, height: 36 };
      case 'lg': return { width: 48, height: 48 };
      case 'xl': return { width: 64, height: 64 };
      default: return { width: 36, height: 36 };
    }
  };

  const { width, height } = getDimensions();

  const svgContent = (
    <svg
      viewBox="0 0 100 100"
      width={width}
      height={height}
      className={`shrink-0 transition-transform ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={alt}
      role="img"
    >
      <defs>
        {/* Top leaf: Grassy emerald to vibrant leaf green */}
        <linearGradient id="sahayaTopGreen" x1="20%" y1="100%" x2="80%" y2="0%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="65%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>

        {/* Left leaf: Royal cobalt blue */}
        <linearGradient id="sahayaLeftBlue" x1="100%" y1="90%" x2="0%" y2="10%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Right leaf: Vibrant ocean teal/turquoise */}
        <linearGradient id="sahayaRightTeal" x1="0%" y1="90%" x2="100%" y2="10%">
          <stop offset="0%" stopColor="#0e7490" />
          <stop offset="55%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Central stem: Royal blue anchor */}
        <linearGradient id="sahayaStemGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Soft shadow for depth */}
        <filter id="leafShadow" x="-10%" y="-10%" width="125%" height="125%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.12" floodColor="#0f172a" />
        </filter>
      </defs>

      <g filter="url(#leafShadow)">
        {/* Branching stem to left leaf */}
        <path
          d="M 47.5 70 C 47.5 58 38 52 28 50 C 37 54 44 61 47.5 70 Z"
          fill="url(#sahayaStemGradient)"
        />

        {/* Branching stem to right leaf */}
        <path
          d="M 52.5 70 C 52.5 58 62 52 72 50 C 63 54 56 61 52.5 70 Z"
          fill="url(#sahayaStemGradient)"
        />

        {/* Top Center Leaf (Green) - organic upright sprout leaf */}
        <path
          d="M 50 45 C 34 35 36 17 51 8 C 66 17 66 35 50 45 Z"
          fill="url(#sahayaTopGreen)"
        />

        {/* Left Leaf (Royal Cobalt Blue) - sweeping outward to left */}
        <path
          d="M 46 68 C 30 73 14 62 11 36 C 28 31 44 48 46 68 Z"
          fill="url(#sahayaLeftBlue)"
        />

        {/* Right Leaf (Teal Cyan Blue) - sweeping outward to right */}
        <path
          d="M 54 68 C 70 73 86 62 89 36 C 72 31 56 48 54 68 Z"
          fill="url(#sahayaRightTeal)"
        />

        {/* Central Stem Trunk */}
        <path
          d="M 47.5 52 L 52.5 52 L 52.5 88 C 52.5 89.6 51.4 90.5 50 90.5 C 48.6 90.5 47.5 89.6 47.5 88 Z"
          fill="url(#sahayaStemGradient)"
        />
      </g>
    </svg>
  );

  const imageContent = (
    <img
      src="/logo.jpg"
      alt={alt}
      width={width}
      height={height}
      referrerPolicy="no-referrer"
      className={`object-contain rounded-lg ${className}`}
    />
  );

  const content = variant === 'image' ? imageContent : svgContent;

  if (withBadge) {
    return (
      <div 
        className={`bg-white rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center p-1.5 shrink-0 ${badgeClassName}`}
        style={{ width: width + 10, height: height + 10 }}
      >
        {content}
      </div>
    );
  }

  return content;
};
