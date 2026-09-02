import React from 'react';

interface ChurchLogoProps {
  className?: string;
  size?: number;
}

export const ChurchLogo: React.FC<ChurchLogoProps> = ({ className = '', size = 50 }) => {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size * 1.25 }}>
      <svg
        viewBox="0 0 100 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* 食パンの外枠（耳） */}
        <path
          d="M 12 115 
             L 12 40 
             C 12 15, 30 5, 50 5 
             C 70 5, 88 15, 88 40 
             L 88 115 
             C 88 118, 85 120, 80 120 
             L 20 120 
             C 15 120, 12 118, 12 115 Z"
          fill="#D97706"
          stroke="#92400E"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* 食パンの内側（白いパン生地） */}
        <path
          d="M 18 112 
             L 18 42 
             C 18 20, 32 12, 50 12 
             C 68 12, 82 20, 82 42 
             L 82 112 
             C 82 114, 80 115, 76 115 
             L 24 115 
             C 20 115, 18 114, 18 112 Z"
          fill="#FFFDF7"
        />

        {/* 中央の十字架 */}
        <g fill="#D97706" stroke="#B45309" strokeWidth="1.5">
          {/* 縦棒 */}
          <rect x="44" y="28" width="12" height="72" rx="2" />
          {/* 横棒 */}
          <rect x="26" y="44" width="48" height="12" rx="2" />
        </g>
      </svg>
    </div>
  );
};
