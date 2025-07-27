import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Code, Zap, Settings2, Crown, Sparkles } from "lucide-react";
import supersalLogo from "@assets/svt sick transparent square  copy_1753601952071.png";

interface CompanionMode {
  id: string;
  name: string;
  personality: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  capabilities: string[];
}

const companionModes: CompanionMode[] = [
  {
    id: "supersal",
    name: "SuperSal™",
    personality: "Professional AI Assistant",
    icon: Crown,
    color: "text-gold",
    description: "Your elite business command center AI with full system access",
    capabilities: ["Business Operations", "System Integration", "Strategic Analysis", "Real-time Monitoring"]
  },
  {
    id: "cookin",
    name: "Cookin' Knowledge",
    personality: "Creative Development Partner",
    icon: Sparkles,
    color: "text-orange-400",
    description: "Your creative coding companion focused on innovation and development",
    capabilities: ["Creative Solutions", "Code Architecture", "Innovation Labs", "Technical Mentoring"]
  }
];

export default function CompanionSwitcher() {
  const [activeMode, setActiveMode] = useState("supersal");
  const [isAdvanced, setIsAdvanced] = useState(true);

  const currentMode = companionModes.find(mode => mode.id === activeMode) || companionModes[0];

  return (
    <Card className="glassmorphism border-gold/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gold">
          <Settings2 className="w-5 h-5" />
          AI Companion Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-3">
          {companionModes.map((mode) => (
            <Button
              key={mode.id}
              variant={activeMode === mode.id ? "default" : "outline"}
              className={`h-auto p-3 flex-col gap-2 ${
                activeMode === mode.id 
                  ? "bg-gold text-charcoal hover:bg-gold/80" 
                  : "border-white/20 hover:border-gold/40"
              }`}
              onClick={() => setActiveMode(mode.id)}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={mode.id === "supersal" ? supersalLogo : undefined} />
                <AvatarFallback className={`${mode.color} bg-transparent`}>
                  <mode.icon className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="font-medium text-xs">{mode.name}</div>
                <div className="text-xs opacity-70">{mode.personality}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Current Mode Info */}
        <div className="bg-surface/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <currentMode.icon className={`w-4 h-4 ${currentMode.color}`} />
            <span className="font-medium text-sm">{currentMode.name} Active</span>
            <Badge variant="secondary" className="text-xs">
              {isAdvanced ? "Advanced" : "Standard"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {currentMode.description}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {currentMode.capabilities.map((capability) => (
              <div key={capability} className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-gold" />
                <span className="text-xs">{capability}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Mode Toggle */}
        <div className="flex items-center justify-between p-2 bg-elevated/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-gold" />
            <div>
              <div className="text-sm font-medium">Advanced Mode</div>
              <div className="text-xs text-muted-foreground">Enhanced capabilities & system access</div>
            </div>
          </div>
          <Switch
            checked={isAdvanced}
            onCheckedChange={setIsAdvanced}
            className="data-[state=checked]:bg-gold"
          />
        </div>

        {/* System Status */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Azure Connected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Stripe Live</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Twilio Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>GHL Mock</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}