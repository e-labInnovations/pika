interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'primary' | 'monochrome' | 'minimalist';
}

const Logo = ({ size = 40, className = '', variant = 'primary' }: LogoProps) => {
  const variants = {
    primary: {
      body: '#4A90E2',
      ears: '#357ABD',
      accent: '#10B981',
    },
    monochrome: {
      body: '#2d3748',
      ears: '#4a5568',
      accent: '#2d3748',
    },
    minimalist: {
      body: '#4A90E2',
      ears: '#4A90E2',
      accent: '#10B981',
    },
  };

  const colors = variants[variant as keyof typeof variants] || variants.primary;

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={`${className}`} xmlns="http://www.w3.org/2000/svg">
      {/* Pika body */}
      <ellipse cx="40" cy="42" rx="18" ry="16" fill={colors.body} />

      {/* Ears */}
      <ellipse cx="31" cy="26" rx="5" ry="11" fill={colors.ears} transform="rotate(-15 31 26)" />
      <ellipse cx="49" cy="26" rx="5" ry="11" fill={colors.ears} transform="rotate(15 49 26)" />

      {/* Inner ears */}
      <ellipse cx="31" cy="27" rx="2.5" ry="6" fill={colors.body} transform="rotate(-15 31 27)" />
      <ellipse cx="49" cy="27" rx="2.5" ry="6" fill={colors.body} transform="rotate(15 49 27)" />

      {/* Eyes */}
      <ellipse cx="35" cy="38" rx="3.5" ry="4" fill="white" />
      <ellipse cx="45" cy="38" rx="3.5" ry="4" fill="white" />
      <ellipse cx="35" cy="38.5" rx="2.5" ry="3" fill="#2d3748" />
      <ellipse cx="45" cy="38.5" rx="2.5" ry="3" fill="#2d3748" />

      {/* Eye highlights */}
      <ellipse cx="34" cy="37" rx="1" ry="1.5" fill="white" />
      <ellipse cx="44" cy="37" rx="1" ry="1.5" fill="white" />

      {/* Nose */}
      <ellipse cx="40" cy="44" rx="1.5" ry="1" fill={colors.ears} />

      {/* Small mouth */}
      <path d="M 38 46 Q 40 47.5 42 46" stroke={colors.ears} strokeWidth="1" fill="none" />

      {/* Money symbol overlay */}
      <circle cx="58" cy="22" r="10" fill={colors.accent} opacity="0.9" />
      <text
        x="58"
        y="27"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="bold"
      >
        $
      </text>
    </svg>
  );
};

export default Logo;
