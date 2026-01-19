export default function Logo() {
  return (
    <div className="flex items-center">
      <svg
        viewBox="0 0 180 32"
        className="h-7 w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* WTF in bright blue */}
        <text
          x="0"
          y="24"
          fill="#3ea6ff"
          fontSize="24"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.01em"
        >
          WTF
        </text>
        
        {/* FIC in white */}
        <text
          x="52"
          y="24"
          fill="#f1f1f1"
          fontSize="24"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.01em"
        >
          FIC
        </text>
        
        {/* Orbital I graphic - Blue circle (dot of i) */}
        <circle
          cx="100"
          cy="10"
          r="3.5"
          fill="#3ea6ff"
        />
        
        {/* Curved orbital line that sweeps up and around */}
        <path
          d="M 103.5 10 Q 108 4, 115 6 Q 122 8, 125 12"
          stroke="#3ea6ff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* TION in white */}
        <text
          x="108"
          y="24"
          fill="#f1f1f1"
          fontSize="24"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.01em"
        >
          TION
        </text>
      </svg>
    </div>
  );
}
