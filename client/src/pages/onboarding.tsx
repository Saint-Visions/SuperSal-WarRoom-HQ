import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Sparkles
} from "lucide-react";

const onboardingOptions = [
  {
    id: "business-intelligence",
    title: "Business Intelligence",
    description: "Real-time analytics, KPIs, and performance monitoring",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    examples: ["Revenue tracking", "Lead conversion analysis", "Performance dashboards"]
  },
  {
    id: "lead-management", 
    title: "Lead Management",
    description: "CRM integration, lead scoring, and pipeline automation",
    icon: Target,
    color: "from-green-500 to-emerald-500",
    examples: ["GoHighLevel sync", "Lead enrichment", "Pipeline automation"]
  },
  {
    id: "ai-assistance",
    title: "AI Assistance",
    description: "OpenAI GPT-4o powered chat, task generation, and workflow optimization",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    examples: ["Strategic planning", "Task automation", "Decision support"]
  },
  {
    id: "communications",
    title: "Communications",
    description: "SMS alerts, calendar sync, and notification management",
    icon: MessageSquare,
    color: "from-orange-500 to-red-500",
    examples: ["Twilio SMS", "Calendar integration", "Real-time alerts"]
  }
];

export default function Onboarding() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [customGoal, setCustomGoal] = useState("");
  const [step, setStep] = useState(1);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleCustomSubmit = () => {
    if (selectedOption || customGoal) {
      // Redirect to the appropriate workspace
      if (selectedOption === "business-intelligence") {
        window.location.href = "/command";
      } else if (selectedOption === "lead-management") {
        window.location.href = "/leads";
      } else if (selectedOption === "ai-assistance") {
        window.location.href = "/warroom";
      } else if (selectedOption === "communications") {
        window.location.href = "/settings";
      } else {
        window.location.href = "/warroom"; // Default to War Room for custom goals
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold text-white">
              Welcome to SuperSal™ War Room HQ
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your AI-powered command center is ready. What would you like to accomplish today?
          </p>
        </motion.div>

        {/* Options Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {onboardingOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 bg-black/60 backdrop-blur-xl border-gray-600 hover:border-gray-400 ${
                  selectedOption === option.id ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => handleOptionSelect(option.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${option.color}`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{option.title}</CardTitle>
                      <p className="text-gray-400 text-sm mt-1">{option.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {option.examples.map((example, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Goal Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-black/60 backdrop-blur-xl border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Or tell us your specific goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., I want to analyze my sales pipeline and automate follow-up sequences..."
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                className="bg-white/5 border-gray-600 text-white placeholder:text-gray-400 focus:border-primary min-h-[100px]"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <Button
            onClick={handleCustomSubmit}
            disabled={!selectedOption && !customGoal.trim()}
            className="px-8 py-3 bg-primary hover:bg-primary/80 text-black font-semibold text-lg h-auto"
          >
            Let's get started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          {!selectedOption && !customGoal.trim() && (
            <p className="text-gray-500 text-sm mt-2">
              Select an option or describe your goal to continue
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}