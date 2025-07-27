import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12", 
  lg: "w-16 h-16",
  xl: "w-24 h-24"
};

// Golden Robot Chef Logo for SaintSalMe workspace
export function GoldenRobotChefLogo({ size = "md", animated = false, className = "" }: LogoProps) {
  const LogoComponent = animated ? motion.img : "img";
  
  return (
    <LogoComponent
      src="/attached_assets/transparent icon cookin dark copy 2_1753624871025.png"
      alt="Sv. Cookin' Knowledge - Golden Robot Chef"
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={(e) => {
        // Fallback to alternative asset path
        const target = e.target as HTMLImageElement;
        target.src = "/attached_assets/transparent icon cookin dark copy_1753625076376.png";
      }}
      {...(animated && {
        animate: {
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })}
    />
  );
}

// Transparent Square Logo for War Room
export function TransparentSquareLogo({ size = "md", animated = false, className = "" }: LogoProps) {
  const LogoComponent = animated ? motion.img : "img";
  
  return (
    <LogoComponent
      src="/attached_assets/svt sick transparent square  copy_1753624836566.png"
      alt="SuperSal War Room - Transparent Square"
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={(e) => {
        // Fallback to alternative square logo
        const target = e.target as HTMLImageElement;
        target.src = "/attached_assets/svt sick transparent square  copy_1753625099367.png";
      }}
      {...(animated && {
        animate: {
          boxShadow: [
            "0 0 20px rgba(59, 130, 246, 0.3)",
            "0 0 40px rgba(59, 130, 246, 0.5)",
            "0 0 20px rgba(59, 130, 246, 0.3)"
          ]
        },
        transition: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })}
    />
  );
}

// Side by Side Logo for Login/General
export function SideBySideLogo({ size = "lg", animated = false, className = "" }: LogoProps) {
  const LogoComponent = animated ? motion.img : "img";
  
  return (
    <LogoComponent
      src="/attached_assets/side by side drip copy_1753601952071.png"
      alt="Sv. | Cookin' Knowledge - Side by Side"
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={(e) => {
        // Fallback to standard cookin logo
        const target = e.target as HTMLImageElement;
        target.src = "/attached_assets/cookin copy_1753612229853.png";
      }}
      {...(animated && {
        animate: {
          y: [0, -5, 0],
        },
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })}
    />
  );
}

// Small Golden "Sv." Logo for Mobile Header
export function SmallGoldenLogo({ size = "sm", animated = false, className = "" }: LogoProps) {
  const LogoComponent = animated ? motion.img : "img";
  
  return (
    <LogoComponent
      src="/attached_assets/transparent icon cookin dark copy 2_1753624871025.png"
      alt="Sv."
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={(e) => {
        // Fallback to alternative golden asset
        const target = e.target as HTMLImageElement;
        target.src = "/attached_assets/cookin knowledge drip_1753601952070.png";
      }}
      {...(animated && {
        animate: {
          filter: [
            "brightness(1) hue-rotate(0deg)",
            "brightness(1.1) hue-rotate(10deg)",
            "brightness(1) hue-rotate(0deg)"
          ]
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      })}
    />
  );
}

// Premium Cookin' Knowledge Wall-Mounted Logo with Splash Effect
export function PremiumCookinLogo({ size = "xl", animated = true, className = "" }: LogoProps) {
  const premiumSizeClasses = {
    sm: "w-32 h-20",
    md: "w-40 h-24", 
    lg: "w-48 h-28",
    xl: "w-56 h-32"
  };

  const LogoComponent = animated ? motion.div : "div";
  
  return (
    <LogoComponent
      className={`relative ${premiumSizeClasses[size]} ${className}`}
      {...(animated && {
        initial: { opacity: 0, scale: 0.9, y: -20 },
        animate: { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          boxShadow: [
            "0 10px 40px rgba(212, 175, 55, 0.3)",
            "0 15px 60px rgba(212, 175, 55, 0.4)",  
            "0 10px 40px rgba(212, 175, 55, 0.3)"
          ]
        },
        transition: {
          duration: 1.5,
          ease: "easeOut",
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      })}
    >
      {/* Wall-mounted frame effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 via-transparent to-black/10 rounded-2xl backdrop-blur-sm border border-white/10" />
      
      {/* Blue to gold gradient splash background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-indigo-500/20 to-amber-400/30 rounded-2xl opacity-60" />
      
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl opacity-0 animate-pulse" 
           style={{
             background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
             animation: "shimmer 4s ease-in-out infinite"
           }} />
      
      {/* Main logo image */}
      <motion.img
        src="/attached_assets/ChatGPT Image Jul 21, 2025, 06_12_13 AM_1753627595618.png"
        alt="Cookin' Knowledge - Premium Wall Logo"
        className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
        {...(animated && {
          animate: {
            filter: [
              "brightness(1.1) contrast(1.1)",
              "brightness(1.2) contrast(1.15)",
              "brightness(1.1) contrast(1.1)"
            ]
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        })}
      />
      
      {/* Floating particles effect */}
      {animated && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full opacity-60"
              style={{
                left: `${20 + (i * 12)}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [-5, -15, -5],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + (i * 0.5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </>
      )}
    </LogoComponent>
  );
}