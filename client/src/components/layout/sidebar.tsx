import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Menu, 
  Globe, 
  Terminal, 
  TrendingUp, 
  CreditCard, 
  Database, 
  Cloud, 
  Github 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanionSwitcher from "./companion-switcher";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const quickLinks = [
  { name: "SaintVisionAI.com", icon: Globe, url: "https://saintvisionai.com" },
  { name: "Replit Console", icon: Terminal, url: "#" },
  { name: "GHL Dashboard", icon: TrendingUp, url: "#" },
  { name: "Stripe", icon: CreditCard, url: "https://dashboard.stripe.com" },
  { name: "Supabase", icon: Database, url: "#" },
  { name: "Azure Portal", icon: Cloud, url: "https://portal.azure.com" },
  { name: "GitHub", icon: Github, url: "https://github.com" },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? "4rem" : "16rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-surface border-r border-white/10 flex flex-col"
    >
      {/* Toggle Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-full hover:bg-white/5 transition-colors"
        >
          <Menu className="w-4 h-4 text-primary" />
        </Button>
      </div>

      {/* Quick Launchers */}
      <div className="px-4 pb-4 flex-1">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {!collapsed && (
            <>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Quick Launch
              </h3>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <link.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm truncate">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </>
          )}
        </motion.div>
        
        {/* Collapsed state icons */}
        {collapsed && (
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={link.name}
              >
                <link.icon className="w-4 h-4 text-primary" />
              </motion.a>
            ))}
          </div>
        )}

        {/* Companion Switcher - only show when expanded */}
        {!collapsed && (
          <motion.div
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="mt-6"
          >
            <CompanionSwitcher />
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
