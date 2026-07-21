'use client';

export default function Logo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  return (
    <div className="flex items-center gap-3 cursor-pointer group select-none">
      <style jsx global>{`
        @keyframes flow-anim {
          0% { 
            stroke-dashoffset: 80; 
            opacity: 0; 
          }
          15% { 
            opacity: 1; 
          }
          85% { 
            opacity: 1; 
          }
          100% { 
            stroke-dashoffset: -20; 
            opacity: 0; 
          }
        }

        .flow-dot {
          stroke: #FF6B4D;
          stroke-width: 5;
          stroke-linecap: round;
          fill: none;
          stroke-dasharray: 8 100;
          animation: flow-anim 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .delay-1 { animation-delay: 0s; }
        .delay-2 { animation-delay: 0.7s; }
        .delay-3 { animation-delay: 1.2s; }
        .delay-4 { animation-delay: 1.8s; }

        @keyframes ring-pulse {
          0% { 
            transform: scale(0.8); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(1.8); 
            opacity: 0; 
          }
        }
        
        .core-pulse {
          transform-origin: 50px 60px;
          animation: ring-pulse 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes core-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        
        .core-solid {
          transform-origin: 50px 60px;
          animation: core-beat 2.5s infinite ease-in-out;
        }

        .svg-text {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Logo Icon Container (Enlarged for high visibility) */}
      <div className={`relative ${size === 'small' ? 'w-12 h-12' : size === 'large' ? 'w-20 h-20' : 'w-16 h-16'} bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_8px_30px_rgba(255,107,77,0.15)] group-hover:border-[#FF6B4D]/40 shrink-0`}>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0A0A0A 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
        
        {/* SVG Logo Graphic */}
        <svg viewBox="0 0 100 100" className="w-full h-full p-1 z-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="coreHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* 1. BASE NETWORK LINES */}
          <g stroke="#FDE3DD" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M 25 25 C 40 15, 50 30, 50 60" />
            <path d="M 75 25 C 60 15, 50 30, 50 60" />
            <path d="M 15 50 C 25 70, 40 70, 50 60" />
            <path d="M 85 50 C 75 70, 60 70, 50 60" />
          </g>

          {/* 2. ANIMATED FLOWING NODES */}
          <path d="M 25 25 C 40 15, 50 30, 50 60" className="flow-dot delay-1" />
          <path d="M 75 25 C 60 15, 50 30, 50 60" className="flow-dot delay-3" />
          <path d="M 15 50 C 25 70, 40 70, 50 60" className="flow-dot delay-2" />
          <path d="M 85 50 C 75 70, 60 70, 50 60" className="flow-dot delay-4" />

          {/* 3. STATIC ORIGIN NODES */}
          <circle cx="25" cy="25" r="3.5" fill="#1F2937" />
          <circle cx="75" cy="25" r="3.5" fill="#1F2937" />
          <circle cx="15" cy="50" r="3.5" fill="#1F2937" />
          <circle cx="85" cy="50" r="3.5" fill="#1F2937" />

          {/* 4. CENTRAL AI CORE */}
          <circle cx="50" cy="60" r="14" fill="#FF6B4D" className="core-pulse" />
          
          <g className="core-solid">
            <rect x="36" y="46" width="28" height="28" rx="8" fill="#FF6B4D" />
            <rect x="37" y="47" width="26" height="26" rx="7" fill="url(#coreHighlight)" />
            <text x="50" y="64" className="svg-text" fontWeight="800" fontSize="12" fill="#FFFFFF" textAnchor="middle">AI</text>
          </g>
        </svg>
      </div>

      {/* Typography Container */}
      <div className="flex flex-col justify-center">
        <h1 className={`${size === 'small' ? 'text-base' : size === 'large' ? 'text-2xl' : 'text-lg'} font-bold tracking-tight text-[#0A0A0A] leading-none font-sans`}>
          Mikir <span className="text-[#FF6B4D]">flow ai</span>
        </h1>
        <p className={`${size === 'small' ? 'text-[9px]' : 'text-[11px]'} font-medium text-[#6B7280] tracking-[0.15em] mt-1 capitalize font-sans`}>
          Think your flow
        </p>
      </div>
    </div>
  );
}
