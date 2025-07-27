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