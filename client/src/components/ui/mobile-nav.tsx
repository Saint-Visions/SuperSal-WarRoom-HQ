import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  Command, 
  Bot, 
  Terminal, 
  Menu, 
  X,
  Home,
  Settings,
  Shield,
  Star,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PartnerTechLogo from "@/components/ui/partnertech-logo";

interface MobileNavProps {
  currentPath: string;
}

const navItems = [
  { path: "/command", icon: Home, label: "Command" },
  { path: "/warroom", icon: Shield, label: "War Room" },
  { path: "/saintsalme", icon: Star, label: "SaintSal" },
  { path: "/tools", icon: Settings, label: "Tools" }
];

export default function MobileNav({ currentPath }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Bottom Navigation - Always Visible */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto p-2 ${
                  currentPath === item.path 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Header - Quick Access Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Command className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">SuperSal™</span>
            <div className="h-4 w-px bg-gray-600"></div>
            <PartnerTechLogo size="sm" showText={false} />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="bg-black/95 backdrop-blur-lg border-b border-white/10 mt-16 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Quick Actions
                </div>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Command className="w-4 h-4 mr-2 text-primary" />
                  Voice Command
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Bot className="w-4 h-4 mr-2 text-primary" />
                  AI Assistant
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Terminal className="w-4 h-4 mr-2 text-primary" />
                  Route Auditor
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}