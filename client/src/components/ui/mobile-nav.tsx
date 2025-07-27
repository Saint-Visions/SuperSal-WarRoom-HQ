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
  Search,
  Brain,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PartnerTechLogo from "@/components/ui/partnertech-logo";
import { SmallGoldenLogo } from "@/components/ui/logo-components";

interface MobileNavProps {
  currentPath: string;
}

const navItems = [
  { path: "/warroom", icon: Shield, label: "War Room", color: "text-cyan-400" },
  { path: "/command", icon: Home, label: "Command", color: "text-blue-400" },
  { path: "/executive", icon: Bot, label: "Executive", color: "text-purple-400" },
  { path: "/saintsalme", icon: Star, label: "Execution", color: "text-amber-400" }
];

export default function MobileNav({ currentPath }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Bottom Navigation - OpenAI Style Quick Access */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-slate-700/50">
        <div className="flex items-center justify-center px-4 py-3">
          {/* Primary War Room Button - Center Focus */}
          <Link href="/warroom">
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
                currentPath === "/warroom" 
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                  : "text-gray-300 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">War Room</span>
            </Button>
          </Link>
          
          {/* Quick Access Dots */}
          <div className="flex items-center space-x-1 ml-4">
            {navItems.slice(1, 4).map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 p-0 rounded-full ${
                    currentPath === item.path 
                      ? `${item.color} bg-primary/10` 
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Header - OpenAI Style Workspace Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <SmallGoldenLogo size="md" animated={true} className="opacity-90 hover:opacity-100 transition-opacity" />
            <div>
              <span className="font-bold text-lg text-amber-400">Sv.</span>
              <p className="text-xs text-slate-400">cookin' knowledge</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/tools">
              <Button variant="ghost" size="sm" className="p-2">
                <Terminal className="w-5 h-5 text-slate-400" />
              </Button>
            </Link>
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
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Workspace Access
                </div>
                
                {/* Primary Workspaces */}
                <div className="space-y-2">
                  <Link href="/warroom" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm py-3">
                      <Shield className="w-4 h-4 mr-3 text-cyan-400" />
                      War Room - Production Center
                    </Button>
                  </Link>
                  <Link href="/saintsalme" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm py-3">
                      <Star className="w-4 h-4 mr-3 text-amber-400" />
                      SaintSalMe - Execution Hub
                    </Button>
                  </Link>
                  <Link href="/command" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm py-3">
                      <Home className="w-4 h-4 mr-3 text-blue-400" />
                      Command Center
                    </Button>
                  </Link>
                </div>

                <div className="border-t border-slate-700 pt-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Intelligence & Tools
                  </div>
                  <Link href="/executive" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm py-2">
                      <Brain className="w-4 h-4 mr-3 text-indigo-400" />
                      SuperSal Executive
                    </Button>  
                  </Link>
                  <Link href="/leads" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm py-2">
                      <Zap className="w-4 h-4 mr-3 text-emerald-400" />
                      Lead Intelligence
                    </Button>
                  </Link>
                  <Link href="/tools" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm py-2">
                      <Terminal className="w-4 h-4 mr-3 text-purple-400" />
                      SuperSal Authority Audit
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm py-2">
                      <Settings className="w-4 h-4 mr-3 text-gray-400" />
                      Configuration
                    </Button>
                  </Link>
                </div>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm py-2"
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