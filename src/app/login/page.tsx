'use client';

import { useState } from 'react';
import { useAuthContext, UserRole } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Mail, 
  Lock,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const { loginAs, usersList } = useAuthContext();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const matchedUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      let roleToLogin: UserRole = 'pm';
      if (matchedUser) {
        roleToLogin = matchedUser.role;
      } else if (email.includes('dev')) {
        roleToLogin = 'developer';
      } else if (email.includes('client') || email.includes('javas')) {
        roleToLogin = 'client';
      }

      loginAs(roleToLogin);
      setIsLoading(false);

      if (roleToLogin === 'client') {
        router.push('/');
      } else {
        router.push('/prd');
      }
    }, 400);
  };

  const infinityPathString = "M 600 400 C 780 200, 1020 200, 1020 400 C 1020 600, 780 600, 600 400 C 420 200, 180 200, 180 400 C 180 600, 420 600, 600 400";

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col justify-center items-center p-6 md:p-12 relative overflow-hidden font-sans select-none">
      
      <style jsx global>{`
        @keyframes infinity-dash-flow {
          0% { stroke-dashoffset: 300; opacity: 0.3; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: -300; opacity: 0.3; }
        }

        .infinity-line {
          stroke-dasharray: 60 300;
          animation: infinity-dash-flow 4s infinite linear;
        }

        @keyframes orbit-along-infinity {
          0% {
            offset-distance: 0%;
          }
          100% {
            offset-distance: 100%;
          }
        }

        .orbiting-node {
          offset-path: path("M 600 400 C 780 200, 1020 200, 1020 400 C 1020 600, 780 600, 600 400 C 420 200, 180 200, 180 400 C 180 600, 420 600, 600 400");
          animation: orbit-along-infinity 6s infinite linear;
          filter: drop-shadow(0 0 12px #FF6B4D) drop-shadow(0 0 20px #FF6B4D);
        }

        .orbit-delay-1 { animation-delay: 0s; }
        .orbit-delay-2 { animation-delay: 1.5s; }
        .orbit-delay-3 { animation-delay: 3s; }
        .orbit-delay-4 { animation-delay: 4.5s; }

        @keyframes node-pulse-glow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(255,107,77,0.7)); }
          50% { transform: scale(1.4); filter: drop-shadow(0 0 25px rgba(255,107,77,1)); }
        }

        .static-glowing-node {
          animation: node-pulse-glow 2.2s infinite ease-in-out;
        }
      `}</style>

      {/* Floating Infinity Node Network Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        
        {/* Soft Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#0A0A0A 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} 
        />

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#FF6B4D]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-orange-300/20 rounded-full blur-3xl animate-pulse" />

        {/* SVG Infinity (∞) Orbit Path & Travelling Nodes */}
        <svg viewBox="0 0 1200 800" className="w-full h-full absolute inset-0 z-0">
          
          {/* Base Track Infinity Path (∞) */}
          <path 
            d={infinityPathString}
            stroke="#FF6B4D" 
            strokeWidth="2.5" 
            opacity="0.15" 
            fill="none" 
            strokeDasharray="6 6"
          />

          {/* Animated Flowing Line */}
          <path 
            d={infinityPathString}
            stroke="#FF6B4D" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round" 
            className="infinity-line"
          />

          {/* Fixed Hub Vertex Dots (∞) */}
          <circle cx="180" cy="400" r="5" fill="#FF6B4D" opacity="0.6" />
          <circle cx="1020" cy="400" r="5" fill="#FF6B4D" opacity="0.6" />
          <circle cx="600" cy="400" r="12" fill="#FF6B4D" className="static-glowing-node" />

          {/* 4 Glowing Node Dots ORBITING CONTINUOUSLY along the Infinity Path (∞) */}
          <circle r="8" fill="#FFFFFF" stroke="#FF6B4D" strokeWidth="3" className="orbiting-node orbit-delay-1" />
          <circle r="8" fill="#FFFFFF" stroke="#FF6B4D" strokeWidth="3" className="orbiting-node orbit-delay-2" />
          <circle r="8" fill="#FFFFFF" stroke="#FF6B4D" strokeWidth="3" className="orbiting-node orbit-delay-3" />
          <circle r="8" fill="#FFFFFF" stroke="#FF6B4D" strokeWidth="3" className="orbiting-node orbit-delay-4" />
        </svg>

      </div>

      {/* Enlarged Login Card Container (max-w-xl = 576px wide, p-10 md:p-12) */}
      <div className="max-w-xl w-full bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.07)] p-10 md:p-12 space-y-9 z-10 animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Enlarge Logo Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <Logo size="large" />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Real Login Form with Enlarged Inputs & Padding */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-900 block tracking-wide uppercase">
              Email Akun
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@mikirflow.ai"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF6B4D] focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-900 block tracking-wide uppercase">
                Kata Sandi
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-bold text-[#FF6B4D] hover:underline">
                Lupa Sandi?
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF6B4D] focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer font-medium">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#FF6B4D] focus:ring-0 cursor-pointer" />
              <span>Ingat sesi saya di perangkat ini</span>
            </label>
          </div>

          {/* Enlarged Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#FF6B4D] hover:bg-[#e65a3d] text-white text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 tracking-wide"
          >
            {isLoading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Masuk ke Platform</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
