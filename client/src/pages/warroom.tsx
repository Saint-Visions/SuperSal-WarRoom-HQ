import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Activity,
  Settings,
  Maximize2,
  RefreshCw,
  Bell,
  Eye,
  Target,
  Gauge,
  Terminal,
  Brain,
  Cpu,
  Database,
  Network,
  Upload,
  Bot,
  MessageSquare,
  Mic,
  Search,
  TrendingUp,
  Users,
  Phone,
  Mail,
  XCircle,
  PlayCircle,
  StopCircle,
  Radio,
  Radar,
  Lock,
  Unlock,
  Globe,
  Server,
  Code,
  FileText,
  BarChart3,
  Slack,
  GitBranch,
  Sparkles,
  Archive,
  History,
  TestTube
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import DragDropZone from "@/components/ui/drag-drop-zone";
import TerminalIntegration from "@/components/ui/terminal-integration";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function WarRoom() {
  const [companionMode, setCompanionMode] = useState("advanced");
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("all");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Real-time system monitoring
  const { data: systemStatus, refetch: refetchSystem } = useQuery({
    queryKey: ['/api/system/status'],
    refetchInterval: 2000, // War Room needs faster updates
  });

  const { data: dashboardData } = useQuery({
    queryKey: ['/api/dashboard'],
    refetchInterval: 10000,
  });

  const { data: brokerageData } = useQuery({
    queryKey: ['/api/brokerage/dashboard'],
    refetchInterval: 15000,
  });

  // AI Assistant with OpenAI-level thinking
  const aiProcessing = useMutation({
    mutationFn: async (input: { command?: string, files?: FileList, audio?: Blob }) => {
      setAiThinking(true);
      
      const formData = new FormData();
      if (input.command) formData.append('command', input.command);
      if (input.files) {
        Array.from(input.files).forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
      }
      if (input.audio) formData.append('audio', input.audio);

      // Simulate OpenAI-level processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return await apiRequest("POST", "/api/warroom/ai-process", formData);
    },
    onSuccess: (data) => {
      setAiThinking(false);
      toast({
        title: "SuperSal™ Analysis Complete",
        description: data.response || "Task processed successfully"
      });
    },
    onError: () => {
      setAiThinking(false);
    }
  });

  // Emergency Actions
  const emergencyAction = useMutation({
    mutationFn: async (action: string) => {
      return await apiRequest("POST", "/api/warroom/emergency", { action });
    },
    onSuccess: (data) => {
      toast({
        title: "Emergency Action",
        description: data.message,
        variant: "destructive"
      });
      refetchSystem();
    }
  });

  // Voice Recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Voice Command Active",
        description: "SuperSal™ is listening for commands..."
      });
    } else {
      toast({
        title: "Processing Voice",
        description: "Analyzing voice command..."
      });
    }
  };

  // System Services with enhanced status
  const services = [
    { 
      name: "Azure Cognitive", 
      status: systemStatus?.find(s => s.service === "azure")?.status || "connected",
      icon: Brain, 
      color: "text-blue-400",
      description: "AI & Speech Services"
    },
    { 
      name: "Stripe Payments", 
      status: systemStatus?.find(s => s.service === "stripe")?.status || "live",
      icon: Database, 
      color: "text-green-400",
      description: "Payment Processing"
    },
    { 
      name: "GoHighLevel", 
      status: systemStatus?.find(s => s.service === "ghl")?.status || "mock",
      icon: Activity, 
      color: "text-yellow-400",
      description: "CRM & Automation"
    },
    { 
      name: "Twilio Comms", 
      status: systemStatus?.find(s => s.service === "twilio")?.status || "active",
      icon: MessageSquare, 
      color: "text-purple-400",
      description: "SMS & Voice"
    },
    {
      name: "PartnerTech.ai",
      status: "operational",
      icon: TrendingUp,
      color: "text-primary",
      description: "Lead Intelligence"
    },
    {
      name: "Saint Vision LLC",
      status: "connected",
      icon: Shield,
      color: "text-purple-400", 
      description: "Brokerage Operations"
    }
  ];

  // Emergency Controls
  const emergencyActions = [
    { id: "system_lockdown", label: "System Lockdown", icon: Lock, variant: "destructive" as const },
    { id: "wipe_memory", label: "Wipe AI Memory", icon: XCircle, variant: "destructive" as const },
    { id: "restart_services", label: "Restart Services", icon: RefreshCw, variant: "secondary" as const },
    { id: "backup_data", label: "Emergency Backup", icon: Database, variant: "outline" as const },
  ];

  // War Room KPIs
  const warRoomMetrics = [
    { label: "System Uptime", value: "99.8%", trend: "+0.2%", color: "text-green-400" },
    { label: "Active Operations", value: dashboardData?.activeOperations || "47", trend: "+5", color: "text-blue-400" },
    { label: "AI Processing", value: aiThinking ? "Processing..." : "Ready", trend: "Normal", color: "text-primary" },
    { label: "Threat Level", value: emergencyMode ? "HIGH" : "LOW", trend: "Stable", color: emergencyMode ? "text-red-400" : "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-black to-charcoal text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* SuperSal™ War Room Header - Bruce Wayne Build */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-primary to-blue-300 bg-clip-text text-transparent font-mono">
                SuperSal™ War Room
              </h1>
              <p className="text-blue-400 mt-1 font-mono text-sm">
                Bruce Wayne Build • Mission Ops • Charcoal x Electric Blue
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                variant={emergencyMode ? "destructive" : "outline"} 
                className={`font-mono ${emergencyMode ? 'animate-pulse border-red-400 text-red-400' : 'border-blue-400 text-blue-400'}`}
              >
                {emergencyMode ? "EMERGENCY MODE" : "OPERATIONAL"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`font-mono border-blue-400 text-blue-400 hover:bg-blue-400/10 ${emergencyMode ? "border-red-500 text-red-400" : ""}`}
              >
                {emergencyMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Real-time War Room Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {warRoomMetrics.map((metric, index) => (
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

        {/* Three-Panel War Room Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Panel: System Monitoring & AI Brain */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* AI Thinking Engine */}
            <Card className="bg-black/60 backdrop-blur-xl border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Brain className={`w-5 h-5 mr-2 ${aiThinking ? 'animate-pulse' : ''}`} />
                  SuperSal™ AI Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mode</span>
                  <Badge variant="outline" className="bg-primary/20 text-primary">
                    {companionMode === "advanced" ? "Advanced" : "Standard"}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Command SuperSal™..."
                      value={commandInput}
                      onChange={(e) => setCommandInput(e.target.value)}
                      className="flex-1 bg-white/5 border-gray-600"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          aiProcessing.mutate({ command: commandInput });
                          setCommandInput("");
                        }
                      }}
                    />
                    <Button
                      onClick={toggleRecording}
                      variant="outline"
                      size="sm"
                      className={isRecording ? "bg-red-500/20 text-red-400 animate-pulse" : ""}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={() => aiProcessing.mutate({ command: commandInput })}
                    disabled={aiProcessing.isPending || !commandInput.trim()}
                    className="w-full bg-primary hover:bg-primary/80 text-black"
                  >
                    {aiProcessing.isPending ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-pulse" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Execute Command
                      </>
                    )}
                  </Button>
                </div>

                {/* AI Status Indicators */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">Active</div>
                    <div className="text-xs text-gray-400">Neural Network</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">Ready</div>
                    <div className="text-xs text-gray-400">Voice Processing</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Services Status */}
            <Card className="bg-black/60 backdrop-blur-xl border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-green-400">
                  <Server className="w-5 h-5 mr-2" />
                  System Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {services.map((service) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <service.icon className={`w-5 h-5 ${service.color}`} />
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-gray-400">{service.description}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        service.status === "connected" || service.status === "live" || service.status === "operational" 
                          ? "text-green-400 border-green-400/30" 
                          : service.status === "mock" 
                          ? "text-yellow-400 border-yellow-400/30"
                          : "text-red-400 border-red-400/30"
                      }
                    >
                      {service.status.toUpperCase()}
                    </Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Panel: Command & Control */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* File Drop Zone */}
            <Card className="bg-black/60 backdrop-blur-xl border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-400">
                  <Upload className="w-5 h-5 mr-2" />
                  Mission Files & Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DragDropZone
                  onFileUpload={(files) => {
                    aiProcessing.mutate({ files });
                  }}
                  className="min-h-[120px]"
                  acceptTypes={["image/*", "text/*", ".pdf", ".doc", ".docx", ".csv", ".json", ".md"]}
                />
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Drop screenshots, documents, or intelligence files for AI analysis
                </p>
              </CardContent>
            </Card>

            {/* Terminal Integration */}
            <Card className="bg-black/60 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Terminal className="w-5 h-5 mr-2" />
                  Command Terminal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TerminalIntegration embedded={true} />
              </CardContent>
            </Card>

            {/* Operations Overview */}
            <Card className="bg-black/60 backdrop-blur-xl border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-400">
                  <Activity className="w-5 h-5 mr-2" />
                  Live Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <div className="text-xl font-bold text-blue-400">
                      {dashboardData?.contacts?.length || 0}
                    </div>
                    <div className="text-xs text-gray-400">Active Contacts</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <div className="text-xl font-bold text-green-400">
                      {brokerageData?.listings || 24}
                    </div>
                    <div className="text-xs text-gray-400">Brokerage Listings</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>System Load</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel: Emergency Controls & Monitoring */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Emergency Controls */}
            <Card className="bg-black/60 backdrop-blur-xl border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-red-400">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  {emergencyActions.map((action) => (
                    <Button
                      key={action.id}
                      variant={action.variant}
                      size="sm"
                      onClick={() => emergencyAction.mutate(action.id)}
                      disabled={!emergencyMode && action.variant === "destructive"}
                      className="justify-start"
                    >
                      <action.icon className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Mode</span>
                  <Switch
                    checked={emergencyMode}
                    onCheckedChange={setEmergencyMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Companion Mode Selector */}
            <Card className="bg-black/60 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Bot className="w-5 h-5 mr-2" />
                  SuperSal™ Companion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={companionMode === "advanced" ? "default" : "outline"}
                    onClick={() => setCompanionMode("advanced")}
                    className="justify-start"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Advanced Mode
                  </Button>
                  <Button
                    variant={companionMode === "standard" ? "default" : "outline"}
                    onClick={() => setCompanionMode("standard")}
                    className="justify-start"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Standard Mode
                  </Button>
                </div>

                <div className="text-xs text-gray-400 p-3 bg-gray-800/30 rounded-lg">
                  {companionMode === "advanced" 
                    ? "Full OpenAI-level thinking, file analysis, voice control, and system integration."
                    : "Basic chat and simple task assistance."
                  }
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="bg-black/60 backdrop-blur-xl border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-400">
                  <Bell className="w-5 h-5 mr-2" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {systemAlerts.length > 0 ? (
                    systemAlerts.map((alert: any, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg mb-2"
                      >
                        <p className="text-sm text-orange-400">{alert.message}</p>
                        <p className="text-xs text-gray-400">{alert.timestamp}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">All systems operational</p>
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}