import { motion } from "framer-motion";
import { Brain, Zap } from "lucide-react";

interface PartnerTechLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  animated?: boolean;
}

export default function PartnerTechLogo({ 
  size = "md", 
  showText = true, 
  animated = false 
}: PartnerTechLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl"
  };

  const LogoIcon = animated ? motion.div : "div";
  const LogoText = animated ? motion.span : "span";

  return (
    <div className="flex items-center space-x-2">
      <LogoIcon
        className={`${sizeClasses[size]} bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center relative overflow-hidden`}
        {...(animated && {
          animate: {
            boxShadow: [
              "0 0 20px rgba(212, 175, 55, 0.3)",
              "0 0 40px rgba(212, 175, 55, 0.5)",
              "0 0 20px rgba(212, 175, 55, 0.3)"
            ]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        })}
      >
        {/* Neural network pattern background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="6" cy="6" r="1" fill="currentColor" />
            <circle cx="18" cy="6" r="1" fill="currentColor" />
            <circle cx="6" cy="18" r="1" fill="currentColor" />
            <circle cx="18" cy="18" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <line x1="6" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="0.5" />
            <line x1="18" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="0.5" />
            <line x1="6" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="0.5" />
            <line x1="18" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        
        {/* Main icon */}
        <Brain className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'} text-black relative z-10`} />
        
        {/* AI spark effect */}
        <Zap className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} text-black absolute top-0 right-0 opacity-60`} />
      </LogoIcon>
      
      {showText && (
        <LogoText 
          className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent`}
          {...(animated && {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.2 }
          })}
        >
          PartnerTech.ai
        </LogoText>
      )}
    </div>
  );
}