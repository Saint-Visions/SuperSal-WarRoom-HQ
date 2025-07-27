import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassmorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

const GlassmorphismCard = forwardRef<HTMLDivElement, GlassmorphismCardProps>(
  ({ className, children, hover = false, glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glassmorphism rounded-xl",
          hover && "hover-lift",
          glow && "hover-glow",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassmorphismCard.displayName = "GlassmorphismCard";

export default GlassmorphismCard;
