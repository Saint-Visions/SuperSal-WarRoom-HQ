import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AppleStyleCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function AppleStyleCard({ 
  children, 
  className = "", 
  hover = true, 
  glow = false 
}: AppleStyleCardProps) {
  return (
    <motion.div
      className={`
        bg-black/40 backdrop-blur-xl 
        border border-white/10 
        rounded-2xl 
        shadow-2xl 
        ${hover ? 'hover:border-primary/40 hover:shadow-primary/20' : ''}
        ${glow ? 'shadow-primary/10' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
      whileHover={hover ? { 
        y: -2,
        boxShadow: glow 
          ? "0 20px 40px rgba(212, 175, 55, 0.2), 0 0 60px rgba(212, 175, 55, 0.1)"
          : "0 20px 40px rgba(0, 0, 0, 0.3)"
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative overflow-hidden rounded-2xl">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// Premium button component with Apple-style design
export function AppleButton({ 
  children, 
  variant = "primary", 
  size = "md",
  onClick,
  disabled = false,
  className = ""
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const baseClasses = "font-medium rounded-xl transition-all duration-200 ease-out flex items-center justify-center";
  
  const variants = {
    primary: `
      bg-gradient-to-r from-primary to-yellow-400 
      text-black 
      shadow-lg shadow-primary/25
      hover:shadow-xl hover:shadow-primary/30
      hover:scale-105
      active:scale-95
    `,
    secondary: `
      bg-white/10 
      text-white 
      border border-white/20
      hover:bg-white/15
      hover:border-white/30
    `,
    ghost: `
      text-gray-300 
      hover:text-white 
      hover:bg-white/5
    `
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}