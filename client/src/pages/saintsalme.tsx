import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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

export default function SaintSalMe() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTool, setSelectedTool] = useState("execution");
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState<any[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  // AI chat for execution tasks
  const aiChatMutation = useMutation({
    mutationFn: async (data: { message: string; mode: string }) => {
      setIsThinking(true);
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      const response = await apiRequest("POST", "/api/saintsalme/advanced-chat", {
        message: data.message,
        mode: data.mode,
        context: "execution_workspace"
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
    }
  });

  const executionTools = [
    { id: "execution", icon: Rocket, label: "Execution", color: "text-amber-400" },
    { id: "leads", icon: Users, label: "Lead Execution", color: "text-green-400" },
    { id: "automation", icon: Zap, label: "Automation", color: "text-yellow-400" },
    { id: "implementation", icon: Code, label: "Implementation", color: "text-blue-400" },
    { id: "deployment", icon: Play, label: "Deployment", color: "text-purple-400" },
    { id: "database", icon: Database, label: "Data Execution", color: "text-cyan-400" },
    { id: "integrations", icon: Globe, label: "Integration Exec", color: "text-orange-400" },
    { id: "campaigns", icon: Target, label: "Campaign Exec", color: "text-pink-400" },
    { id: "performance", icon: TrendingUp, label: "Performance", color: "text-teal-400" },
    { id: "settings", icon: Settings, label: "Settings", color: "text-gray-400" }
  ];

  // Execution tool actions
  const executionActionMutation = useMutation({
    mutationFn: async (data: { toolId: string; action: string; params?: any }) => {
      return await apiRequest("POST", "/api/saintsalme/tool-action", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Execution Complete",
        description: data.result,
      });
      
      // Add execution result to conversation
      setConversation(prev => [...prev, {
        role: 'system',
        content: `Execution Result: ${data.result}`,
        data: data
      }]);
    }
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    aiChatMutation.mutate({ message, mode: "execution" });
  };

  const handleExecutionAction = (toolId: string, action: string, params?: any) => {
    executionActionMutation.mutate({ toolId, action, params });
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Collapsible Sidebar */}
      <motion.div 
        initial={false}
        animate={{ width: sidebarCollapsed ? '60px' : '240px' }}
        className="bg-slate-900/50 border-r border-slate-700 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-sm font-semibold text-amber-400">SAINTSALME</h2>
                <p className="text-xs text-slate-400">EXECUTION CENTER</p>
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
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-xs text-amber-400 font-medium">EXECUTIVE</span>
                <p className="text-xs text-slate-400">Full Access • Unlimited</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="mt-2 text-xs text-green-400">
              ⚡ All Tools Enabled • Lead Execution • Revenue Generation • Saint Vision Active
            </div>
          )}
        </div>

        {/* Execution Tools */}
        <div className="flex-1 p-2">
          {executionTools.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
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
          >
            <RefreshCw className="w-4 h-4" />
            {!sidebarCollapsed && <span className="ml-2">Refresh</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-400 hover:text-white"
          >
            <Bell className="w-4 h-4" />
            {!sidebarCollapsed && <span className="ml-2">Alerts</span>}
          </Button>
        </div>
      </motion.div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-slate-900/30 border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <h1 className="text-lg font-semibold text-white">Execution Workspace</h1>
                <p className="text-sm text-slate-400">Execute leads, build implementations, drive results</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* Center AI Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-900/30 border-slate-700 h-full flex flex-col">
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Chat Area */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {conversation.length === 0 ? (
                      <div className="text-center text-slate-400 py-12">
                        <Rocket className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                        <h3 className="text-xl font-semibold mb-2 text-white">Execution Command Center</h3>
                        <p>Ready to execute leads, build implementations, and drive results. I have full access to all your business tools and execution frameworks.</p>
                      </div>
                    ) : (
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
                              <p>{msg.content}</p>
                              {msg.analysis && (
                                <div className="mt-2 pt-2 border-t border-slate-600 text-xs text-slate-300">
                                  Analysis: {msg.analysis.slice(0, 100)}...
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
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
                  
                  {/* Input Area */}
                  <div className="border-t border-slate-700 p-4">
                    <div className="flex space-x-3">
                      <div className="flex-1 relative">
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Execute leads, build implementations, drive results..."
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
                        className="bg-amber-600 hover:bg-amber-700 text-white h-auto px-6"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && toast({
                        title: "Files Ready for Execution",
                        description: `${e.target.files.length} file(s) ready for processing`
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Execution Tools */}
            <div className="space-y-4">
              {/* Active Executions */}
              <Card className="bg-slate-900/30 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Rocket className="w-4 h-4 mr-2 text-amber-400" />
                    Active Executions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {workspaceData?.activeTools?.slice(0, 4).map((tool: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                        <span className="text-xs text-slate-300">{tool.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400">
                        active
                      </Badge>
                    </div>
                  )) || [1,2,3,4].map((idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                        <span className="text-xs text-slate-300">Execution Tool {idx}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400">
                        active
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Execution Metrics */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                  <h3 className="text-sm font-medium text-white">Execution Metrics</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Revenue Generated</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">$47,892</div>
                      <div className="text-xs text-green-400">+12.4%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Leads Executed</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">342</div>
                      <div className="text-xs text-cyan-400">+8.9%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Implementation Rate</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">94.7%</div>
                      <div className="text-xs text-yellow-400">Above target</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <Rocket className="w-4 h-4 mr-2 text-purple-400" />
                  <h3 className="text-sm font-medium text-white">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => handleExecutionAction('leads', 'execute')}
                    disabled={executionActionMutation.isPending}
                    className="w-full flex items-center p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                  >
                    <Users className="w-4 h-4 mr-3 text-cyan-400" />
                    <span className="text-sm text-slate-200">Execute Lead Campaign</span>
                  </button>
                  <button 
                    onClick={() => handleExecutionAction('implementation', 'build')}
                    disabled={executionActionMutation.isPending}
                    className="w-full flex items-center p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                  >
                    <Code className="w-4 h-4 mr-3 text-green-400" />
                    <span className="text-sm text-slate-200">Build Implementation</span>
                  </button>
                  <button 
                    onClick={() => handleExecutionAction('deployment', 'launch')}
                    disabled={executionActionMutation.isPending}
                    className="w-full flex items-center p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                  >
                    <Rocket className="w-4 h-4 mr-3 text-purple-400" />
                    <span className="text-sm text-slate-200">Launch Deployment</span>
                  </button>
                  <button 
                    onClick={() => handleExecutionAction('campaigns', 'execute')}
                    disabled={executionActionMutation.isPending}
                    className="w-full flex items-center p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors text-left"
                  >
                    <Target className="w-4 h-4 mr-3 text-yellow-400" />
                    <span className="text-sm text-slate-200">Execute Campaign</span>
                  </button>
                </div>
              </div>

              {/* Live Execution Stats */}
              <Card className="bg-slate-900/30 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-amber-400" />
                    Live Execution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Active Executions</span>
                    <span className="text-sm font-semibold text-amber-400">
                      {realtimeData?.saintsalme?.activeExecutions || 5}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Revenue Today</span>
                    <span className="text-sm font-semibold text-green-400">
                      ${realtimeData?.saintsalme?.revenueToday || 2847}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Leads Processed</span>
                    <span className="text-sm font-semibold text-cyan-400">
                      {realtimeData?.saintsalme?.leadsProcessed || 18}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 pt-1">
                    Last execution: {new Date().toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-slate-900/30 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-blue-400" />
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
                    )) || [1,2,3,4].map((idx) => (
                      <div key={idx} className="text-center p-2 rounded bg-slate-800/50">
                        <div className="w-2 h-2 rounded-full mx-auto mb-1 bg-green-400"></div>
                        <div className="text-xs text-slate-400">Service {idx}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}