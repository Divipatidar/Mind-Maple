export function Logo({ size = 200 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left hemisphere */}
      <path
        d="M60 100 Q60 60 100 60 V100 Q80 100 60 100"
        fill="black"
      />
      
      {/* Right hemisphere */}
      <path
        d="M140 100 Q140 60 100 60 V100 Q120 100 140 100"
        fill="black"
      />
      
      {/* Bottom part of brain */}
      <path
        d="M60 100 Q60 140 100 140 Q140 140 140 100"
        fill="black"
      />
      
      {/* Brain folds */}
      <path
        d="M70 70 Q85 50 100 70 M130 70 Q115 50 100 70
           M65 90 Q80 70 100 90 M135 90 Q120 70 100 90
           M70 110 Q85 90 100 110 M130 110 Q115 90 100 110
           M80 130 Q90 110 100 130 M120 130 Q110 110 100 130"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Central divide */}
      <path
        d="M100 60 V140"
        stroke="white"
        strokeWidth="2"
      />
      
      {/* Lightbulb base */}
      <path
        d="M85 140 L85 160 Q100 170 115 160 L115 140"
        stroke="black"
        strokeWidth="10"
        fill="none"
      />
      
      {/* Light rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <line
          key={angle}
          x1={100 + 70 * Math.cos(angle * Math.PI / 180)}
          y1={100 + 70 * Math.sin(angle * Math.PI / 180)}
          x2={100 + 90 * Math.cos(angle * Math.PI / 180)}
          y2={100 + 90 * Math.sin(angle * Math.PI / 180)}
          stroke="black"
          strokeWidth="4"
        />
      ))}
    </svg>
  );
}