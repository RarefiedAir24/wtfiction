export default function Logo() {
  return (
    <div className="flex items-center">
      <svg
        viewBox="0 0 200 32"
        className="h-8 w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* WTF in bright blue */}
        <text
          x="0"
          y="26"
          fill="#3ea6ff"
          fontSize="26"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0"
        >
          WTF
        </text>
        
        {/* FIC in white */}
        <text
          x="58"
          y="26"
          fill="#f1f1f1"
          fontSize="26"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0"
        >
          FIC
        </text>
        
        {/* Orbital I graphic - Blue circle (dot of i) */}
        <circle
          cx="108"
          cy="10"
          r="4"
          fill="#3ea6ff"
        />
        
        {/* Curved orbital line that sweeps up, around, and behind C, continuing to O and N */}
        <path
          d="M 112 10 Q 118 2, 128 4 Q 138 6, 145 10 Q 152 14, 155 18"
          stroke="#3ea6ff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* TION in white */}
        <text
          x="118"
          y="26"
          fill="#f1f1f1"
          fontSize="26"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0"
        >
          TION
        </text>
      </svg>
    </div>
  );
}
