import Logo from './logo';

const PikaIcon = ({
  size = 24,
  className = '',
  style = 'filled', // "filled", "outline", "minimal"
}: {
  size?: number;
  className?: string;
  style?: 'filled' | 'outline' | 'minimal';
}) => {
  const baseClasses = 'inline-block';

  const styleClasses = {
    filled: 'drop-shadow-sm',
    outline: 'border border-gray-200 rounded-full p-1',
    minimal: 'opacity-80 hover:opacity-100 transition-opacity',
  };

  return <Logo size={size} className={`${baseClasses} ${styleClasses[style]} ${className}`} />;
};

export default PikaIcon;
