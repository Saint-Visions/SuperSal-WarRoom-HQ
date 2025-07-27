import { Brain, Gauge, Bot, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  activeScreen: "command" | "ai" | "devlab";
  onScreenChange: (screen: "command" | "ai" | "devlab") => void;
}

export default function Header({ activeScreen, onScreenChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">
              SuperSal™ <span className="text-primary">War Room HQ</span>
            </h1>
          </div>
          <div className="hidden md:block text-xs text-gray-400">
            Personal AI Command Center
          </div>
        </div>

        {/* Screen Navigation Tabs */}
        <nav className="flex space-x-1 bg-charcoal rounded-lg p-1">
          <Button
            variant={activeScreen === "command" ? "default" : "ghost"}
            size="sm"
            onClick={() => onScreenChange("command")}
            className="tab-btn"
          >
            <Gauge className="w-4 h-4 mr-2" />
            Command
          </Button>
          <Button
            variant={activeScreen === "ai" ? "default" : "ghost"}
            size="sm"
            onClick={() => onScreenChange("ai")}
            className="tab-btn"
          >
            <Bot className="w-4 h-4 mr-2" />
            AI Tools
          </Button>
          <Button
            variant={activeScreen === "devlab" ? "default" : "ghost"}
            size="sm"
            onClick={() => onScreenChange("devlab")}
            className="tab-btn"
          >
            <Code className="w-4 h-4 mr-2" />
            DevLab
          </Button>
        </nav>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm">
            <div className="status-online" />
            <span className="text-gray-300">Ryan Capatosto</span>
          </div>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
            <AvatarFallback>RC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
