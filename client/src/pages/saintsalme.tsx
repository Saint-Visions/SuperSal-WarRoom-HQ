import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Brain, 
  Heart,
  Star,
  Zap,
  MessageSquare,
  User,
  Settings,
  Crown,
  Sparkles,
  Bot,
  Coffee,
  Target,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DragDropZone from "@/components/ui/drag-drop-zone";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SaintSalMe() {
  const [personalMessage, setPersonalMessage] = useState("");
  const [currentMood, setCurrentMood] = useState("focused");
  const [dailyGoals, setDailyGoals] = useState([]);
  const { toast } = useToast();

  // Personal dashboard data
  const { data: personalData } = useQuery({
    queryKey: ['/api/personal/dashboard'],
    refetchInterval: 30000,
  });

  const { data: saintsalData } = useQuery({
    queryKey: ['/api/saintsalme/profile'],
  });

  // Personal AI interaction
  const personalChat = useMutation({
    mutationFn: async (message: string) => {
      return await apiRequest("POST", "/api/saintsalme/chat", { message });
    },
    onSuccess: (data) => {
      toast({
        title: "SaintSal Response",
        description: data.response
      });
    }
  });

  const moods = [
    { id: "focused", label: "Focused", icon: Target, color: "text-blue-400" },
    { id: "creative", label: "Creative", icon: Sparkles, color: "text-purple-400" },
    { id: "strategic", label: "Strategic", icon: Brain, color: "text-primary" },
    { id: "relaxed", label: "Relaxed", icon: Coffee, color: "text-green-400" }
  ];

  const personalMetrics = [
    { label: "Daily Energy", value: "87%", trend: "+12%", color: "text-green-400" },
    { label: "Goals Completed", value: "6/8", trend: "75%", color: "text-blue-400" },
    { label: "Focus Score", value: "9.2/10", trend: "+0.8", color: "text-primary" },
    { label: "Stress Level", value: "Low", trend: "-15%", color: "text-green-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-black to-purple-900/20 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Personal Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-primary">
                <AvatarImage src="/api/placeholder/64/64" />
                <AvatarFallback className="bg-primary text-black text-xl font-bold">
                  RC
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  SaintSal + Me
                </h1>
                <p className="text-gray-400 mt-1">Ryan Capatosto • Personal Command Center • Saint Vision Group LLC</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-primary/20 text-primary animate-pulse">
                <Crown className="w-3 h-3 mr-1" />
                Executive Mode
              </Badge>
              <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
                Saint Vision Active
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Personal Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {personalMetrics.map((metric, index) => (
            <Card key={metric.label} className="bg-black/60 backdrop-blur-xl border-primary/20">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold mb-1" style={{ color: metric.color.replace('text-', '') }}>
                  {metric.value}
                </div>
                <p className="text-sm text-gray-400">{metric.label}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.trend}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Personal Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Panel: Personal AI & Mood */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Personal AI Chat */}
            <Card className="bg-black/60 backdrop-blur-xl border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Bot className="w-5 h-5 mr-2" />
                  Personal SaintSal Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Talk to your personal AI about goals, strategies, or just life..."
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  className="min-h-[100px] bg-white/5 border-gray-600 focus:border-primary resize-none"
                />
                <Button
                  onClick={() => {
                    personalChat.mutate(personalMessage);
                    setPersonalMessage("");
                  }}
                  disabled={!personalMessage.trim() || personalChat.isPending}
                  className="w-full bg-primary hover:bg-primary/80 text-black"
                >
                  {personalChat.isPending ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-pulse" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat with SaintSal
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Current Mood Selector */}
            <Card className="bg-black/60 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <Heart className="w-5 h-5 mr-2" />
                  Current Vibe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={currentMood === mood.id ? "default" : "outline"}
                      onClick={() => setCurrentMood(mood.id)}
                      className="justify-start"
                      size="sm"
                    >
                      <mood.icon className={`w-4 h-4 mr-2 ${mood.color}`} />
                      {mood.label}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-gray-400 p-3 bg-gray-800/30 rounded-lg">
                  Currently feeling: <span className="text-primary capitalize">{currentMood}</span>
                </div>
              </CardContent>
            </Card>

            {/* Saint Vision Brokerage Personal */}
            <Card className="bg-black/60 backdrop-blur-xl border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Shield className="w-5 h-5 mr-2" />
                  My Saint Vision Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Personal Listings</p>
                    <p className="text-xl font-bold text-green-400">8</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Monthly Commission</p>
                    <p className="text-xl font-bold text-primary">$4.2K</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Personal Goal Progress</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Panel: Daily Goals & Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Daily Goals */}
            <Card className="bg-black/60 backdrop-blur-xl border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-400">
                  <Target className="w-5 h-5 mr-2" />
                  Today's Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: 1, task: "Complete 3 GHL automations", done: true },
                  { id: 2, task: "Review Saint Vision pipeline", done: true },
                  { id: 3, task: "SuperSal™ AI training session", done: false },
                  { id: 4, task: "Call top 5 warm leads", done: false },
                  { id: 5, task: "Update PartnerTech.ai profiles", done: true }
                ].map((goal) => (
                  <div key={goal.id} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                    <div className={`w-4 h-4 rounded-full ${goal.done ? 'bg-green-400' : 'bg-gray-600'}`} />
                    <span className={goal.done ? 'line-through text-gray-400' : 'text-white'}>{goal.task}</span>
                    {goal.done && <Star className="w-4 h-4 text-yellow-400 ml-auto" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Personal File Drop */}
            <Card className="bg-black/60 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Zap className="w-5 h-5 mr-2" />
                  Personal Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DragDropZone
                  className="min-h-[120px]"
                  acceptTypes={["image/*", "text/*", ".pdf", ".doc", ".docx"]}
                  onFileUpload={(files) => {
                    toast({
                      title: "Files Added to Personal Archive",
                      description: `${files.length} file(s) added to your private intelligence system`
                    });
                  }}
                />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Personal documents, screenshots, and private notes
                </p>
              </CardContent>
            </Card>

            {/* Personal Insights */}
            <Card className="bg-black/60 backdrop-blur-xl border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-400">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Personal Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-400 font-medium">Peak Performance Time</p>
                  <p className="text-xs text-gray-300">Your best focus hours are 9-11 AM based on recent activity</p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-400 font-medium">Revenue Opportunity</p>
                  <p className="text-xs text-gray-300">3 warm leads in Saint Vision pipeline ready for follow-up</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-400 font-medium">Automation Win</p>
                  <p className="text-xs text-gray-300">GHL sequences saved you 2.5 hours this week</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel: Personal Stats & Reflection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Personal Growth */}
            <Card className="bg-black/60 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Personal Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Business Skills</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>AI Integration</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Leadership</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Work-Life Balance</span>
                    <span>76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Personal Achievements */}
            <Card className="bg-black/60 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <Crown className="w-5 h-5 mr-2" />
                  Recent Wins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Star, text: "Closed $45K Saint Vision deal", color: "text-yellow-400" },
                  { icon: Zap, text: "SuperSal™ War Room deployed", color: "text-primary" },
                  { icon: TrendingUp, text: "PartnerTech.ai revenue +127%", color: "text-green-400" },
                  { icon: Shield, text: "Perfect GHL automation week", color: "text-blue-400" }
                ].map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                    <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                    <span className="text-sm">{achievement.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Personal Reflection */}
            <Card className="bg-black/60 backdrop-blur-xl border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Heart className="w-5 h-5 mr-2" />
                  Daily Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What went well today? What could be improved? Any insights or gratitude to capture..."
                  className="min-h-[100px] bg-white/5 border-gray-600 focus:border-green-400 resize-none"
                />
                <Button className="w-full mt-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30">
                  Save Reflection
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}