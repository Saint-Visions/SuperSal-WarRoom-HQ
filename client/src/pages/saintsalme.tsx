import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown,
  Sparkles,
  Brain,
  Zap,
  FileText,
  MessageSquare,
  Settings,
  Database,
  Code,
  BarChart3,
  Users,
  Globe,
  Shield,
  Send,
  Upload,
  Maximize2,
  Minimize2,
  Mic,
  MicOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SaintSalMe() {
  const [message, setMessage] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentMode, setCurrentMode] = useState("Advanced");
  const [conversation, setConversation] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Production data queries for full workspace
  const { data: businessMetrics } = useQuery({
    queryKey: ['/api/metrics/business'],
    refetchInterval: 30000,
  });

  const { data: systemStatus } = useQuery({
    queryKey: ['/api/system/status'],
    refetchInterval: 5000,
  });

  // AI chat mutation with OpenAI-style processing
  const aiChatMutation = useMutation({
    mutationFn: async (data: { message: string; mode: string; attachments?: any[] }) => {
      setIsThinking(true);
      // Simulate OpenAI-style thinking time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      const response = await apiRequest("POST", "/api/saintsalme/advanced-chat", {
        message: data.message,
        mode: data.mode,
        attachments: data.attachments,
        context: "full_workspace_access"
      });
      
      setIsThinking(false);
      return response;
    },
    onSuccess: (data) => {
      setConversation(prev => [...prev, 
        { role: 'user', content: message },
        { role: 'assistant', content: data.response, analysis: data.analysis }
      ]);
      setMessage("");
    },
    onError: (error) => {
      setIsThinking(false);
      toast({
        title: "Connection Error",
        description: "Unable to reach SaintSal AI. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    aiChatMutation.mutate({
      message,
      mode: currentMode,
      attachments: []
    });
  };

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    toast({
      title: "Files Uploaded",
      description: `${fileArray.length} file(s) ready for analysis`
    });
  };

  const workspaceTools = [
    { name: "Business Intelligence", icon: BarChart3, color: "text-blue-400", status: "active" },
    { name: "Lead Management", icon: Users, color: "text-green-400", status: "active" },
    { name: "Database Access", icon: Database, color: "text-purple-400", status: "active" },
    { name: "Code Analysis", icon: Code, color: "text-yellow-400", status: "active" },
    { name: "Web Integration", icon: Globe, color: "text-cyan-400", status: "active" },
    { name: "Security Controls", icon: Shield, color: "text-red-400", status: "active" }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-black to-blue-900/20 text-white transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : 'p-6'}`}>
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Crown className="w-8 h-8 text-amber-400" />
              <Sparkles className="w-4 h-4 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent">
                SaintSal™ Full Workspace
              </h1>
              <p className="text-slate-400">Complete AI-powered productivity suite with unlimited access</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant={isFullscreen ? "default" : "outline"}
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              Full Access • All Tools Enabled
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Main AI Chat Interface - OpenAI Style */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-900/50 border-slate-700 h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-blue-400" />
                    <div>
                      <CardTitle className="text-xl">Advanced AI Assistant</CardTitle>
                      <p className="text-sm text-slate-400">Production-ready with full system integration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={currentMode === "Advanced" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentMode("Advanced")}
                    >
                      Advanced
                    </Button>
                    <Button
                      variant={currentMode === "Standard" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentMode("Standard")}
                    >
                      Standard
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Conversation Area */}
                <div className="flex-1 bg-slate-800/30 rounded-lg p-4 mb-4 overflow-y-auto max-h-96">
                  <AnimatePresence>
                    {conversation.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-slate-400 py-8"
                      >
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                        <h3 className="text-lg font-semibold mb-2">SaintSal™ AI Ready</h3>
                        <p>Ask anything - I have full access to all your business tools and data.</p>
                      </motion.div>
                    ) : (
                      conversation.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`inline-block p-3 rounded-lg max-w-md ${
                            msg.role === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-700 text-slate-100'
                          }`}>
                            <p>{msg.content}</p>
                            {msg.analysis && (
                              <div className="mt-2 pt-2 border-t border-slate-600 text-xs text-slate-300">
                                Analysis: {msg.analysis.slice(0, 100)}...
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                    
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-left mb-4"
                      >
                        <div className="inline-block p-3 rounded-lg bg-slate-700">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                            <span className="text-slate-300">SaintSal is thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Input Area */}
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask SaintSal anything - full business intelligence, lead management, analytics..."
                        className="bg-slate-800 border-slate-600 text-white min-h-[80px] pr-24"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="absolute bottom-2 right-2 flex space-x-1">
                        <Button
                          size="sm"
                          variant={isVoiceMode ? "default" : "outline"}
                          onClick={() => setIsVoiceMode(!isVoiceMode)}
                        >
                          {isVoiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isThinking}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Tools & Analytics */}
          <div className="space-y-6">
            {/* Active Tools */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Workspace Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workspaceTools.map((tool, idx) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50"
                  >
                    <div className="flex items-center space-x-2">
                      <tool.icon className={`w-4 h-4 ${tool.color}`} />
                      <span className="text-sm text-slate-300">{tool.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                      {tool.status}
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Metrics */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                  Quick Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessMetrics?.slice(0, 3).map((metric: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">{metric.name}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">{metric.value}</div>
                      <div className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-400' : 
                        metric.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {typeof metric.change === 'number' ? 
                          `${metric.change > 0 ? '+' : ''}${metric.change.toFixed(1)}%` : 
                          metric.change
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {systemStatus?.slice(0, 4).map((status: any, idx: number) => (
                    <div key={idx} className="text-center p-2 rounded bg-slate-800/50">
                      <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                        status.status === 'operational' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                      <div className="text-xs text-slate-400">{status.service}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}