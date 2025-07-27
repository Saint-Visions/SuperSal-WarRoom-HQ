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

// AI Brain Circuit Board Logo with Neural Network Effects
export function AIBrainLogo({ size = "xl", animated = true, className = "" }: LogoProps) {
  const brainSizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32", 
    lg: "w-40 h-40",
    xl: "w-48 h-48"
  };

  const LogoComponent = animated ? motion.div : "div";
  
  return (
    <LogoComponent
      className={`relative ${brainSizeClasses[size]} ${className}`}
      {...(animated && {
        initial: { opacity: 0, scale: 0.9, rotate: -5 },
        animate: { 
          opacity: 1, 
          scale: 1, 
          rotate: 0,
        },
        transition: {
          duration: 1.2,
          ease: "easeOut"
        }
      })}
    >
      {/* Neural network glow effect */}
      <div className="absolute inset-0 rounded-2xl" 
           style={{
             background: "radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)",
             filter: "blur(8px)"
           }} />
      
      {/* Main AI brain logo */}
      <motion.img
        src="/attached_assets/cxookimn trsansparent  copy_1753628280325.png"
        alt="SV AI Brain - Intelligence Engine"
        className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
        {...(animated && {
          animate: {
            filter: [
              "brightness(1) contrast(1.1)",
              "brightness(1.1) contrast(1.2)",
              "brightness(1) contrast(1.1)"
            ]
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        })}
      />
      
      {/* Circuit board pulse effects */}
      {animated && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
              style={{
                left: `${15 + (i * 10)}%`,
                top: `${20 + (i % 4) * 15}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.25
              }}
            />
          ))}
        </>
      )}
    </LogoComponent>
  );
}