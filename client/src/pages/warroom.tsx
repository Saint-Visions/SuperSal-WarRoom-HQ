import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import ParallaxBackground from "@/components/parallax-background";
import { 
  Activity,
  BarChart3,
  Brain,
  Database,
  Globe,
  Home,
  MessageSquare,
  Radar,
  Settings,
  Shield,
  Target,
  Zap,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Maximize2,
  Send,
  Upload,
  Mic,
  MicOff,
  RefreshCw,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { MemoryPanel } from "@/components/ui/memory-panel";
import SuperSalAuthorityPanel from "@/components/supersal-authority-panel";

export default function WarRoom() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTool, setSelectedTool] = useState("analytics");
  const [activeTab, setActiveTab] = useState("operations");
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState<any[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Production data queries
  const { data: systemStatus } = useQuery({
    queryKey: ['/api/system/status'],
    refetchInterval: 5000,
  });

  const { data: businessMetrics } = useQuery({
    queryKey: ['/api/metrics/business'],
    refetchInterval: 30000,
  });

  const { data: realtimeData } = useQuery({
    queryKey: ['/api/workspace/realtime'],
    refetchInterval: 3000,
    initialData: { warroom: { status: 'operational', connections: 12, activeUsers: 8 } }
  });

  // AI chat for production planning
  const aiChatMutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      setIsThinking(true);
      
      try {
        const response = await apiRequest("POST", "/api/warroom/production-chat", {
          message: data.message,
          context: "production_planning"
        });
        
        const jsonData = await response.json();
        console.log('API Response:', jsonData);
        return jsonData;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setIsThinking(false);
      console.log('Received response:', data);
      
      // Add AI response to existing conversation
      if (data && data.response) {
        setConversation(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        console.error('No response content received:', data);
        setConversation(prev => [...prev, { role: 'assistant', content: 'I received your message but encountered an issue with the response. Please try again.' }]);
      }
    },
    onError: (error) => {
      setIsThinking(false);
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const sidebarTools = [
    { id: "productivity", icon: Target, label: "Productivity", color: "text-cyan-400" },
    { id: "analytics", icon: BarChart3, label: "Analytics", color: "text-blue-400" },
    { id: "monitoring", icon: Activity, label: "Monitoring", color: "text-green-400" },
    { id: "database", icon: Database, label: "Database", color: "text-purple-400" },
    { id: "automation", icon: Zap, label: "Automation", color: "text-yellow-400" },
    { id: "intelligence", icon: Brain, label: "Intelligence", color: "text-pink-400" },
    { id: "security", icon: Shield, label: "Security", color: "text-red-400" },
    { id: "integrations", icon: Globe, label: "Integrations", color: "text-orange-400" },
    { id: "radar", icon: Radar, label: "Radar", color: "text-teal-400" },
    { id: "authority", icon: Shield, label: "SuperSal Authority", color: "text-primary" },
    { id: "settings", icon: Settings, label: "Settings", color: "text-gray-400" }
  ];

  // Tool action mutations
  const toolActionMutation = useMutation({
    mutationFn: async (data: { toolId: string; action: string; params?: any }) => {
      return await apiRequest("POST", "/api/warroom/tool-action", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Tool Executed",
        description: data.result,
      });
      
      // Add tool result to conversation
      setConversation(prev => [...prev, {
        role: 'system',
        content: `Tool Result: ${data.result}`,
        data: data
      }]);
    }
  });

  const handleSendMessage = () => {
    if (!message.trim() || aiChatMutation.isPending) return;
    
    console.log('Sending message:', message);
    
    // Add user message immediately to conversation
    const userMessage = message;
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessage("");
    
    // Send to API
    aiChatMutation.mutate({ message: userMessage });
  };

  const handleToolAction = (toolId: string, action: string, params?: any) => {
    toolActionMutation.mutate({ toolId, action, params });
  };

  return (
    <ParallaxBackground className="min-h-screen">
      <div className="min-h-screen bg-black/90 text-white flex relative overflow-hidden">
      {/* Collapsible Sidebar - Full Height */}
      <motion.div 
        initial={false}
        animate={{ width: sidebarCollapsed ? '60px' : '280px' }}
        className="bg-slate-900/30 backdrop-blur-xl border-r border-slate-700/50 flex flex-col absolute left-0 top-0 h-full z-20"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 bg-cover bg-center rounded opacity-90 hover:opacity-100 transition-opacity border border-cyan-400/20"
                  style={{
                    backgroundImage: `url('/attached_assets/Frame 1000002501_1753624236163.png')`,
                    backgroundSize: 'cover'
                  }}
                />
                <div>
                  <h2 className="text-sm font-semibold text-cyan-400">saintsal™ war room</h2>
                  <p className="text-xs text-slate-400">production command center</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 h-8 w-8"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="p-3 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-xs text-green-400 font-medium">LIVE</span>
                <p className="text-xs text-slate-400">Azure • SaintSalGPT 4.1</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="mt-2 text-xs text-yellow-400">
              🔥 Enterprise Route Intelligence: 47+ Clients • $8,947 Revenue • Premium Add-On Available
            </div>
          )}
        </div>

        {/* Tools */}
        <div className="flex-1 p-2">
          {sidebarTools.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => {
                setSelectedTool(tool.id);
                if (tool.id !== 'authority') {
                  // Map tools to their correct actions
                  const actionMap = {
                    'analytics': 'analyze',
                    'monitoring': 'status', 
                    'database': 'query',
                    'automation': 'execute',
                    'intelligence': 'analyze',
                    'productivity': 'optimize',
                    'security': 'scan',
                    'integrations': 'status',
                    'radar': 'scan',
                    'settings': 'configure'
                  };
                  const action = actionMap[tool.id] || 'execute';
                  handleToolAction(tool.id, action);
                }
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                selectedTool === tool.id ? 'bg-slate-700' : 'hover:bg-slate-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tool.icon className={`w-5 h-5 ${tool.color}`} />
              {!sidebarCollapsed && (
                <span className="text-sm text-slate-300">{tool.label}</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-400 hover:text-white"
            onClick={() => handleToolAction('system', 'refresh')}
          >
            <RefreshCw className="w-4 h-4" />
            {!sidebarCollapsed && <span className="ml-2">Refresh</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-400 hover:text-white"
            onClick={() => handleToolAction('alerts', 'toggle')}
          >
            <Bell className="w-4 h-4" />
            {!sidebarCollapsed && <span className="ml-2">Alerts</span>}
          </Button>
        </div>
      </motion.div>

      {/* Main Workspace - Full Screen */}
      <motion.div 
        animate={{ marginLeft: sidebarCollapsed ? '60px' : '280px' }}
        className="flex-1 flex flex-col min-h-screen relative"
      >
        {/* Immersive Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/attached_assets/transparent icon cookin dark copy_1753626655136.png"
                alt="Sv. Cookin' Knowledge"
                className="w-12 h-12 opacity-90 hover:opacity-100 transition-opacity"
              />
              <div>
                <h1 className="text-3xl font-bold text-cyan-400">saintsal™ war room</h1>
                <p className="text-slate-300">Production command center with divine authority</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 px-4 py-2">
                {realtimeData?.warroom?.connections || 12} Live Connections
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 px-4 py-2">
                Divine Authority
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Area - OpenAI Mobile Style */}
        <div className="flex-1 pt-24 md:pt-32 px-4 md:px-6 pb-24 relative">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-5"
            style={{
              backgroundImage: `url('/attached_assets/cookin copy_1753612229853.png')`,
              backgroundSize: '400px',
              backgroundPosition: 'center center'
            }}
          />
          
          {/* Mobile-Optimized Chat Interface */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Mobile Widget Sizes - OpenAI Style */}

            
            {/* Chat Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full px-8">
              <div className="h-full flex flex-col justify-center">
                
                <div className="flex-1 overflow-y-auto mb-6 min-h-[400px]">
                  {selectedTool === "authority" ? (
                    <div className="h-full">
                      <SuperSalAuthorityPanel />
                    </div>
                  ) : conversation.length === 0 && !message.trim() && !isThinking ? (
                    <div className="text-center text-slate-400 py-12 h-full flex flex-col justify-center">
                      <Target className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">saintsal™ production command center</h3>
                      <p className="text-sm md:text-base">Ready to execute business operations, analyze data, and manage workflows. Ask me anything about production planning.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {conversation.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                          >
                            <div className={`inline-block p-4 rounded-lg max-w-md ${
                              msg.role === 'user' 
                                ? 'bg-cyan-600 text-white' 
                                : 'bg-slate-700 text-slate-100'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
                
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-left mb-4"
                  >
                    <div className="inline-block p-4 rounded-lg bg-slate-700">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
                        <span className="text-slate-300">Analyzing production data...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Input Area */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Execute business operations, analyze data, manage workflows..."
                        className="bg-slate-800/50 border-slate-600 text-white min-h-[60px] pr-20 rounded-xl"
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
                          variant={isVoiceMode ? "default" : "ghost"}
                          onClick={() => setIsVoiceMode(!isVoiceMode)}
                          className="h-8 w-8 p-0"
                        >
                          {isVoiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 w-8 p-0"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isThinking}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white h-auto px-6"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Footer Status */}
                  <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-slate-400">
                    <span>Dual companion ready</span>
                    <span>•</span>
                    <span>Azure-powered</span>
                    <span>•</span>
                    <span className="text-cyan-400">Production-grade operations</span>
                    <span>•</span>
                    <span className="text-amber-400">SAINTAL GOTTA GUY ⚡</span>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && toast({
                      title: "Files Ready",
                      description: `${e.target.files.length} file(s) ready for analysis`
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Search Bar - War Room Style */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 z-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,.pdf,.txt,.doc,.docx"
              />
              <div className="flex-1 relative">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter production command or query..."
                  className="w-full bg-slate-900/80 backdrop-blur-xl border-slate-600/50 text-white resize-none rounded-xl px-4 md:px-6 py-3 md:py-4 pr-28 md:pr-32 text-sm md:text-base"
                  rows={1}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-slate-700/50"
                  >
                    <Upload className="w-4 h-4 text-slate-400 hover:text-white" />
                  </Button>
                  <Button
                    onClick={() => setIsVoiceMode(!isVoiceMode)}
                    variant="ghost"
                    size="sm"
                    className="p-2 hover:bg-slate-700/50"
                  >
                    {isVoiceMode ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-slate-400 hover:text-white" />}
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || aiChatMutation.isPending}
                    className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </ParallaxBackground>
  );
}