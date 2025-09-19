import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  variant = 'default',
  className = '' 
}) => {
  const sizes = {
    sm: { icon: 24, text: 'text-sm' },
    md: { icon: 32, text: 'text-lg' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-4xl' }
  };

  const colors = {
    default: {
      primary: '#2563eb',
      secondary: '#ffffff',
      text: 'text-gray-900'
    },
    white: {
      primary: '#ffffff',
      secondary: '#2563eb',
      text: 'text-white'
    },
    dark: {
      primary: '#1e40af',
      secondary: '#ffffff',
      text: 'text-gray-900'
    }
  };

  const currentSize = sizes[size];
  const currentColors = colors[variant];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={currentSize.icon} 
        height={currentSize.icon} 
        viewBox="0 0 32 32" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background */}
        <circle cx="16" cy="16" r="15" fill={currentColors.primary} />
        
        {/* Shield */}
        <path 
          d="M11 9 Q11 7 13 7 H19 Q21 7 21 9 V15 Q21 21 16 23 Q11 21 11 15 V9 Z" 
          fill={currentColors.secondary}
        />
        
        {/* Location Pin */}
        <circle cx="16" cy="12" r="2.5" fill={currentColors.primary} />
        <circle cx="16" cy="12" r="1" fill={currentColors.secondary} />
        <path d="M16 14.5 L14.5 18 Q16 17 17.5 18 Z" fill={currentColors.primary} />
        
        {/* Compass */}
        <g transform="translate(21, 21)">
          <circle cx="0" cy="0" r="3" fill={currentColors.secondary} />
          <polygon points="0,-2 1,0 0,2 -1,0" fill={currentColors.primary} />
        </g>
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${currentSize.text} ${currentColors.text} leading-tight`}>
            YatraKavach
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className={`text-xs ${currentColors.text} opacity-70 -mt-1`}>
              Travel Safety Companion
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Logo;