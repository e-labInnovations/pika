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
      <ellipse
        cx="39.97826"
        cy="42.255432"
        rx="20.10326"
        ry="17.869564"
        fill={colors.body}
        style={{ strokeWidth: 1.11685 }}
      />

      {/* Ears */}
      <ellipse
        cx="22.595377"
        cy="31.300522"
        rx="5.584239"
        ry="12.285325"
        fill={colors.ears}
        transform="rotate(-15)"
        style={{ strokeWidth: 1.11685 }}
      />
      <ellipse
        cx="54.636688"
        cy="10.606252"
        rx="5.584239"
        ry="12.285325"
        fill={colors.ears}
        transform="rotate(15)"
        style={{ strokeWidth: 1.11685 }}
      />

      {/* Inner ears */}
      <ellipse
        cx="22.306314"
        cy="32.379314"
        rx="2.7921195"
        ry="6.7010865"
        fill={colors.body}
        transform="rotate(-15)"
        style={{ strokeWidth: 1.11685 }}
      />
      <ellipse
        cx="54.925751"
        cy="11.685044"
        rx="2.7921195"
        ry="6.7010865"
        fill={colors.body}
        transform="rotate(15)"
        style={{ strokeWidth: 1.11685 }}
      />

      {/* Eyes */}
      <ellipse
        cx="34.39402"
        cy="37.788044"
        rx="3.9089673"
        ry="4.467391"
        fill="#ffffff"
        style={{ strokeWidth: 1.11685 }}
      />
      <ellipse
        cx="45.5625"
        cy="37.788044"
        rx="3.9089673"
        ry="4.467391"
        fill="#ffffff"
        style={{ strokeWidth: 1.11685 }}
      />
      <ellipse
        cx="34.39402"
        cy="38.346466"
        rx="2.7921195"
        ry="3.3505435"
        fill="#2d3748"
        style={{ strokeWidth: 1.11685 }}
      />
      <ellipse
        cx="45.5625"
        cy="38.346466"
        rx="2.7921195"
        ry="3.3505435"
        fill="#2d3748"
        style={{ strokeWidth: 1.11685 }}
      />

      {/* Eye highlights */}
      <ellipse
        cx="33.277172"
        cy="36.671196"
        rx="1.1168478"
        ry="1.6752717"
        fill="#ffffff"
        style={{ strokeWidth: 1.11685 }}
      />
      <ellipse
        cx="44.445652"
        cy="36.671196"
        rx="1.1168478"
        ry="1.6752717"
        fill="#ffffff"
        style={{ strokeWidth: 1.11685 }}
      />

      {/* Nose */}
      <ellipse
        cx="39.97826"
        cy="44.489128"
        rx="1.6752717"
        ry="1.1168478"
        fill={colors.ears}
        style={{ strokeWidth: 1.11685 }}
      />

      {/* Small mouth */}
      <path
        d="m 37.744564,46.722825 q 2.233696,1.675272 4.467391,0"
        stroke={colors.ears}
        strokeWidth="1.11685"
        fill="none"
      />

      {/* Money symbol overlay */}
      <circle
        cx="60.547928"
        cy="23.6143"
        r="11.192925"
        fill={colors.accent}
        opacity="0.9"
        style={{ strokeWidth: 1.11929 }}
      />
      <path
        d="m 64.099274,25.39817 q 0,1.187062 -0.800119,1.842897 -0.79356,0.649276 -2.354447,0.708301 V 29.09708 H 60.229847 V 27.969044 Q 58.819802,27.916577 58.0328,27.30665 57.245798,26.690165 56.996581,25.424404 l 1.678937,-0.308243 q 0.124609,0.741094 0.491877,1.088686 0.373826,0.341035 1.062452,0.406618 V 24.04715 q -0.01967,-0.01312 -0.09837,-0.02623 -0.0787,-0.01967 -0.104933,-0.01967 -1.062453,-0.242659 -1.606796,-0.570577 -0.537785,-0.334475 -0.832911,-0.839468 -0.295125,-0.511552 -0.295125,-1.246087 0,-1.088686 0.747652,-1.685496 0.75421,-0.59681 2.190488,-0.649276 v -0.878827 h 0.714856 v 0.878819 q 0.859143,0.03279 1.42972,0.27545 0.577135,0.236101 0.924727,0.701744 0.354151,0.459084 0.570577,1.318228 l -1.731405,0.255776 q -0.09837,-0.570577 -0.386942,-0.878819 -0.28201,-0.314801 -0.806677,-0.386943 v 2.308539 l 0.07214,0.01312 q 0.190192,0 1.15427,0.314801 0.970636,0.314801 1.449395,0.931286 0.47876,0.609926 0.47876,1.534653 z m -3.869427,-5.128629 q -1.219853,0.09182 -1.219853,1.049336 0,0.288567 0.09838,0.478759 0.104933,0.190193 0.295125,0.314801 0.196751,0.124609 0.826352,0.334476 z m 2.164256,5.154863 q 0,-0.327918 -0.11805,-0.531227 -0.118051,-0.209867 -0.347593,-0.341034 -0.222984,-0.131167 -0.983752,-0.347592 v 2.406914 q 1.449395,-0.09838 1.449395,-1.187061 z"
        style={{
          fontWeight: 'bold',
          fontSize: 13.4315,
          fontFamily: 'Arial, sans-serif',
          textAnchor: 'middle',
          fill: '#ffffff',
          strokeWidth: 1.11929,
        }}
        aria-label="$"
      />
    </svg>
  );
};

export default Logo;
