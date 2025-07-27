import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import ParallaxBackground from "@/components/parallax-background";
import saintsalPromoImage from "@assets/small_promo_tile_resized copy_1753625694053.png";
import { 
  Zap,
  Users,
  Crown,
  Rocket,
  Code,
  Database,
  Globe,
  MessageSquare,
  Settings,
  Play,
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
  Bell,
  Target,
  TrendingUp,
  Brain,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { MemoryPanel } from "@/components/ui/memory-panel";

export default function SaintSalMe() {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  const [selectedTool, setSelectedTool] = useState("execution");
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState<any[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await apiRequest('/api/upload/saintsalme', {
        method: 'POST',
        body: formData,
      });

      if (response.success) {
        toast({
          title: "Files Uploaded Successfully",
          description: `${files.length} file(s) uploaded and analyzed by AI`,
        });
        
        // Add to conversation
        setConversation(prev => [...prev, {
          role: 'system',
          content: `📁 Uploaded ${files.length} file(s): ${files.map(f => f.name).join(', ')}. Files have been analyzed and added to AI memory.`
        }]);
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
    }
  };

  // Production data queries for execution workspace
  const { data: businessMetrics } = useQuery({
    queryKey: ['/api/metrics/business'],
    refetchInterval: 30000,
  });

  const { data: systemStatus } = useQuery({
    queryKey: ['/api/system/status'],
    refetchInterval: 5000,
  });

  const { data: workspaceData } = useQuery({
    queryKey: ['/api/saintsalme/workspace'],
    refetchInterval: 10000,
  });

  const { data: realtimeData } = useQuery({
    queryKey: ['/api/workspace/realtime'],
    refetchInterval: 3000,
  });

  // Chat mutation for AI responses
  const chatMutation = useMutation({
    mutationFn: async (input: { message: string }) => {
      const response = await apiRequest('/api/chat/saintsalme', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return response;
    },
    onSuccess: (data) => {
      setConversation(prev => [...prev, { role: 'assistant', content: data.response, analysis: data.analysis }]);
      setIsThinking(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setIsThinking(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!message.trim() || isThinking) return;
    
    const userMessage = message.trim();
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessage("");
    setIsThinking(true);
    
    chatMutation.mutate({ message: userMessage });
  };

  const executionTools = [
    { id: "execution", icon: Rocket, label: "Lead Execution", description: "Execute leads and campaigns", color: "text-amber-400" },
    { id: "deployment", icon: Globe, label: "Deployment", description: "Deploy and launch systems", color: "text-green-400" },
    { id: "implementation", icon: Code, label: "Implementation", description: "Build and implement solutions", color: "text-blue-400" },
    { id: "campaign", icon: Target, label: "Campaign", description: "Manage marketing campaigns", color: "text-purple-400" },
    { id: "intelligence", icon: Brain, label: "Intelligence", description: "AI-powered insights", color: "text-cyan-400" },
    { id: "analytics", icon: TrendingUp, label: "Analytics", description: "Performance analytics", color: "text-orange-400" },
    { id: "automation", icon: Zap, label: "Automation", description: "Workflow automation", color: "text-pink-400" },
    { id: "database", icon: Database, label: "Database", description: "Data management", color: "text-slate-400" }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Parallax Background */}
      <ParallaxBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex h-screen"
      >
        {/* Left Collapsible Sidebar */}
        <motion.div
          initial={false}  
          animate={{ width: leftSidebarCollapsed ? 60 : 280 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-slate-900/30 backdrop-blur-xl border-r border-slate-700/50 flex flex-col"
        >
          {/* Left Sidebar Header */}
          <div className="p-4 border-b border-slate-700/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              className="w-full justify-start text-amber-400 hover:text-amber-300 hover:bg-amber-400/10"
            >
              {leftSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5 mr-2" />}
              {!leftSidebarCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>

          {/* Tool Navigation */}
          <div className="flex-1 p-2 space-y-1">
            {executionTools.map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTool(tool.id)}
                className={`w-full justify-start ${
                  selectedTool === tool.id 
                    ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                } ${leftSidebarCollapsed ? 'px-2' : 'px-3'}`}
              >
                <tool.icon className={`w-5 h-5 ${tool.color} ${leftSidebarCollapsed ? '' : 'mr-3'}`} />
                {!leftSidebarCollapsed && (
                  <div className="text-left">
                    <div className="font-medium">{tool.label}</div>
                    <div className="text-xs text-slate-500">{tool.description}</div>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Immersive Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/attached_assets/transparent icon cookin dark copy_1753625076376.png"
                  alt="Sv. Cookin' Knowledge Robot Chef"
                  className="w-12 h-12 opacity-90 hover:opacity-100 transition-opacity"
                />
                <div>
                  <h1 className="text-3xl font-bold text-amber-400">saintsal™ + you</h1>
                  <p className="text-slate-300">Professional execution center powered by divine intelligence</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 px-4 py-2">
                  {realtimeData?.saintsalme?.activeExecutions || 5} Active
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 px-4 py-2">
                  Divine Authority
                </Badge>
              </div>
            </div>
          </div>

          {/* Full Height Generous Chat Interface */}
          <div className="flex-1 pt-20 md:pt-24 px-4 md:px-8 pb-20 relative">
            {/* Professional SaintSal Background */}
            <div 
              className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-15"
              style={{
                backgroundImage: `url('${saintsalPromoImage}')`,
                backgroundSize: '600px',
                backgroundPosition: 'center center'
              }}
            />
            
            {/* Generous Chat Workspace */}
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex-1 max-w-5xl mx-auto w-full px-4">
                <div className="h-full flex flex-col justify-center">
                  
                  <div className="flex-1 overflow-y-auto mb-6 min-h-[400px]">
                    {conversation.length === 0 && !message.trim() && !isThinking ? (
                      <div className="text-center text-slate-400 py-12 h-full flex flex-col justify-center">
                        <Rocket className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                        <h3 className="text-xl font-semibold mb-2 text-white">saintsal™ + you</h3>
                        <p>Professional partnership for business execution. Ready to implement leads, build solutions, and drive results with comprehensive business intelligence.</p>
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
                                  ? 'bg-amber-600 text-white' 
                                  : 'bg-slate-700 text-slate-100'
                              }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-left mb-4"
                      >
                        <div className="inline-block p-4 rounded-lg bg-slate-700">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full"></div>
                            <span className="text-slate-300">Executing your request...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Bottom Search/Chat Bar - Full Width */}
                  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-20">
                    <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl">
                      <div className="flex items-center space-x-4 p-4">
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
                            placeholder="Enter execution command or query..."
                            className="w-full bg-transparent border-none text-white placeholder-slate-400 resize-none text-base focus:outline-none pr-20"
                            rows={1}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                              }
                            }}
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 p-2"
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsVoiceMode(!isVoiceMode)}
                              className={`${isVoiceMode ? 'text-red-400 hover:text-red-300' : 'text-amber-400 hover:text-amber-300'} hover:bg-amber-400/10 p-2`}
                            >
                              {isVoiceMode ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </Button>
                            <Button
                              onClick={handleSubmit}
                              disabled={!message.trim() || isThinking}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Collapsible Sidebar */}
        <motion.div
          initial={false}  
          animate={{ width: rightSidebarCollapsed ? 60 : 280 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-slate-900/30 backdrop-blur-xl border-l border-slate-700/50 flex flex-col"
        >
          {/* Right Sidebar Header */}
          <div className="p-4 border-b border-slate-700/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
              className="w-full justify-start text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
            >
              {rightSidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 mr-2" />}
              {!rightSidebarCollapsed && <span className="ml-2">Collapse</span>}
            </Button>
          </div>

          {/* Right Panel Tools */}
          <div className="flex-1 p-2 space-y-1">
            {[
              { id: "memory", icon: Brain, label: "AI Memory", description: "Conversation context", color: "text-cyan-400" },
              { id: "files", icon: Upload, label: "File Manager", description: "Upload & manage files", color: "text-green-400" },
              { id: "voice", icon: Mic, label: "Voice Control", description: "Voice commands", color: "text-purple-400" },
              { id: "settings", icon: Settings, label: "Settings", description: "Workspace preferences", color: "text-slate-400" },
              { id: "search", icon: Search, label: "Search", description: "Advanced search", color: "text-blue-400" },
              { id: "filter", icon: Filter, label: "Filters", description: "Content filtering", color: "text-orange-400" },
              { id: "refresh", icon: RefreshCw, label: "Refresh", description: "Reload workspace", color: "text-pink-400" },
              { id: "notifications", icon: Bell, label: "Alerts", description: "System notifications", color: "text-red-400" }
            ].map((tool) => (
              <Button
                key={tool.id}
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (tool.id === 'files') {
                    // Show drag-drop upload modal
                    toast({
                      title: "File Manager Active",
                      description: "Drag files anywhere in the workspace to upload",
                    });
                  } else if (tool.id === 'memory') {
                    // Show memory panel modal
                    toast({
                      title: "AI Memory Panel",
                      description: "Memory system ready for interaction",
                    });
                  }
                }}
                className={`w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800/50 ${rightSidebarCollapsed ? 'px-2' : 'px-3'}`}
              >
                <tool.icon className={`w-5 h-5 ${tool.color} ${rightSidebarCollapsed ? '' : 'mr-3'}`} />
                {!rightSidebarCollapsed && (
                  <div className="text-left">
                    <div className="font-medium">{tool.label}</div>
                    <div className="text-xs text-slate-500">{tool.description}</div>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}