import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import CommandScreen from "@/components/screens/command-screen";
import AIScreen from "@/components/screens/ai-screen";
import DevLabScreen from "@/components/screens/devlab-screen";

type Screen = "command" | "ai" | "devlab";

export default function CommandCenter() {
  const [activeScreen, setActiveScreen] = useState<Screen>("command");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const screenComponents = {
    command: CommandScreen,
    ai: AIScreen,
    devlab: DevLabScreen,
  };

  const ActiveScreenComponent = screenComponents[activeScreen];

  return (
    <div className="min-h-screen bg-charcoal text-white logo-watermark">
      <Header activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      
      <div className="flex h-screen">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="screen-content p-2 md:p-6 space-y-4 md:space-y-6"
            >
              <ActiveScreenComponent />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
