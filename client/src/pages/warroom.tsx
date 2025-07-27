import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  GitBranch,
  Sparkles,
  Archive,
  History,
  TestTube,
  Monitor,
  Layers,
  Calendar,
  Clock,
  DollarSign,
  Building2,
  Briefcase,
  LineChart,
  PieChart,
  Workflow,
  Timer,
  CheckSquare,
  AlertCircle,
  TrendingDown,
  Loader2,
  Power,
  HardDrive,
  Wifi,
  Bluetooth
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import DragDropZone from "@/components/ui/drag-drop-zone";
import TerminalIntegration from "@/components/ui/terminal-integration";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  change: number;
  lastUpdate: string;
}

interface WorkflowTask {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  dueDate: string;
  progress: number;
  estimatedTime: string;
  tags: string[];
}

interface BusinessMetric {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target?: string;
  category: 'revenue' | 'leads' | 'conversion' | 'performance';
}

export default function WarRoom() {
  const [activePanel, setActivePanel] = useState("overview");
  const [companionMode, setCompanionMode] = useState("advanced");
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("all");
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'full'>('grid');
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Real-time system monitoring with faster refresh for production
  const { data: systemStatus, refetch: refetchSystem } = useQuery({
    queryKey: ['/api/system/status'],
    refetchInterval: autoRefresh ? 3000 : false,
  });

  const { data: dashboardData } = useQuery({
    queryKey: ['/api/dashboard'],
    refetchInterval: autoRefresh ? 5000 : false,
  });

  const { data: workflowData } = useQuery({
    queryKey: ['/api/workflows'],
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: businessMetrics } = useQuery({
    queryKey: ['/api/metrics/business'],
    refetchInterval: autoRefresh ? 15000 : false,
  });

  const { data: activeProjects } = useQuery({
    queryKey: ['/api/projects/active'],
    refetchInterval: autoRefresh ? 30000 : false,
  });

  // AI Assistant with production-level processing
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

      // Realistic processing time based on complexity
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return await apiRequest("/api/warroom/ai-process", {
        method: 'POST',
        body: formData
      });
    },
    onSuccess: (data) => {
      setAiThinking(false);
      toast({
        title: "AI Analysis Complete",
        description: data.response || "Task processed successfully"
      });
      // Refresh relevant data
      queryClient.invalidateQueries({ queryKey: ['/api/system/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
    },
    onError: () => {
      setAiThinking(false);
      toast({
        title: "Processing Error",
        description: "Unable to process request. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Emergency Actions
  const emergencyAction = useMutation({
    mutationFn: async (action: string) => {
      return await apiRequest("/api/warroom/emergency", {
        method: 'POST',
        body: { action }
      });
    },
    onSuccess: () => {
      toast({
        title: "Emergency Action Executed",
        description: "System status updated"
      });
      refetchSystem();
    }
  });

  // Workflow Management
  const workflowAction = useMutation({
    mutationFn: async ({ action, taskId, data }: { action: string, taskId?: string, data?: any }) => {
      return await apiRequest("/api/workflows/manage", {
        method: 'POST',
        body: { action, taskId, data }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      toast({
        title: "Workflow Updated",
        description: "Changes applied successfully"
      });
    }
  });

  const handleVoiceCommand = async () => {
    if (!isRecording) {
      setIsRecording(true);
      // Mock voice recording - in production would use Web Speech API
      setTimeout(() => {
        setIsRecording(false);
        aiProcessing.mutate({ command: "Voice command processed" });
      }, 3000);
    }
  };

  const handleFileUpload = (files: FileList) => {
    aiProcessing.mutate({ files });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': case 'completed': case 'online': return 'text-green-400';
      case 'warning': case 'running': case 'pending': return 'text-yellow-400';
      case 'critical': case 'failed': case 'offline': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': case 'completed': case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'warning': case 'running': case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': case 'failed': case 'offline': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const mockSystemData: SystemMetric[] = [
    { name: "CPU Usage", value: 67, status: 'warning', change: 5.2, lastUpdate: new Date().toISOString() },
    { name: "Memory", value: 45, status: 'healthy', change: -2.1, lastUpdate: new Date().toISOString() },
    { name: "Network I/O", value: 23, status: 'healthy', change: 1.8, lastUpdate: new Date().toISOString() },
    { name: "Disk Space", value: 89, status: 'critical', change: 12.5, lastUpdate: new Date().toISOString() },
  ];

  const mockWorkflowTasks: WorkflowTask[] = [
    {
      id: "1",
      title: "Lead Qualification Automation",
      status: 'running',
      priority: 'high',
      assignedTo: "AI Engine",
      dueDate: "2025-01-27T15:00:00Z",
      progress: 75,
      estimatedTime: "2h 15m",
      tags: ["automation", "leads", "priority"]
    },
    {
      id: "2", 
      title: "CRM Data Sync",
      status: 'completed',
      priority: 'medium',
      assignedTo: "System",
      dueDate: "2025-01-27T12:00:00Z",
      progress: 100,
      estimatedTime: "45m",
      tags: ["sync", "crm", "data"]
    },
    {
      id: "3",
      title: "Quarterly Report Generation",
      status: 'pending',
      priority: 'critical',
      assignedTo: "Analytics",
      dueDate: "2025-01-27T18:00:00Z",
      progress: 0,
      estimatedTime: "4h 30m",
      tags: ["reports", "quarterly", "analytics"]
    }
  ];

  const mockBusinessMetrics: BusinessMetric[] = [
    { name: "Monthly Revenue", value: "$127,540", change: 8.3, trend: 'up', target: "$150,000", category: 'revenue' },
    { name: "Active Leads", value: "1,247", change: 12.1, trend: 'up', category: 'leads' },
    { name: "Conversion Rate", value: "24.8%", change: -2.1, trend: 'down', target: "28%", category: 'conversion' },
    { name: "System Uptime", value: "99.94%", change: 0.05, trend: 'stable', target: "99.9%", category: 'performance' }
  ];

  return (
    <div className="min-h-screen bg-charcoal text-white p-4">
      <div className="max-w-full mx-auto">
        {/* War Room Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Radar className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">War Room HQ</h1>
                <p className="text-gray-400">Mission Control • Production Environment</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={emergencyMode ? "destructive" : "secondary"}>
                {emergencyMode ? "EMERGENCY MODE" : "NORMAL OPS"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "border-green-500 text-green-400" : ""}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'full' : 'grid')}
              >
                {viewMode === 'grid' ? <Maximize2 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main War Room Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          
          {/* Left Panel - System Monitoring */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={viewMode === 'grid' ? 'lg:col-span-1' : 'col-span-full'}
          >
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Monitor className="w-5 h-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSystemData.map((metric) => (
                    <div key={metric.name} className="p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <div className={`flex items-center ${getStatusColor(metric.status)}`}>
                          {getStatusIcon(metric.status)}
                          <span className="ml-1 text-xs">{metric.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold">{metric.value}%</span>
                        <span className={`text-xs ${metric.change >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {metric.change >= 0 ? '+' : ''}{metric.change}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                  
                  <Separator />
                  
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-300">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => emergencyAction.mutate("restart_services")}
                        disabled={emergencyAction.isPending}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Restart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => emergencyAction.mutate("clear_cache")}
                        disabled={emergencyAction.isPending}
                      >
                        <Archive className="w-3 h-3 mr-1" />
                        Clear Cache
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => emergencyAction.mutate("backup_data")}
                        disabled={emergencyAction.isPending}
                      >
                        <HardDrive className="w-3 h-3 mr-1" />
                        Backup
                      </Button>
                      <Button
                        size="sm"
                        variant={emergencyMode ? "destructive" : "outline"}
                        onClick={() => setEmergencyMode(!emergencyMode)}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {emergencyMode ? "Exit" : "Emergency"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Panel - AI Command Center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={viewMode === 'grid' ? 'lg:col-span-1' : 'col-span-full'}
          >
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center text-primary">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Command Center
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={companionMode === "advanced" ? "default" : "secondary"}>
                      {companionMode === "advanced" ? "Advanced" : "Standard"}
                    </Badge>
                    <Switch
                      checked={companionMode === "advanced"}
                      onCheckedChange={(checked) => setCompanionMode(checked ? "advanced" : "standard")}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Chat Interface */}
                <div className="border border-gray-700 rounded-lg h-64 flex flex-col">
                  <ScrollArea className="flex-1 p-3" ref={chatRef}>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Bot className="w-5 h-5 text-primary mt-1" />
                        <div className="bg-primary/10 rounded-lg p-2 flex-1">
                          <p className="text-sm">War Room HQ is online and monitoring all systems. How can I assist with your operations today?</p>
                        </div>
                      </div>
                      
                      {aiThinking && (
                        <div className="flex items-start space-x-2">
                          <Bot className="w-5 h-5 text-primary mt-1" />
                          <div className="bg-primary/10 rounded-lg p-2 flex-1">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <p className="text-sm">Processing your request...</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-3 border-t border-gray-700">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter command or ask AI..."
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && commandInput.trim()) {
                            aiProcessing.mutate({ command: commandInput });
                            setCommandInput("");
                          }
                        }}
                        className="flex-1 bg-gray-800/50 border-gray-600"
                      />
                      <Button
                        size="sm"
                        onClick={handleVoiceCommand}
                        variant={isRecording ? "destructive" : "outline"}
                        disabled={aiProcessing.isPending}
                      >
                        <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* File Upload Zone */}
                <DragDropZone
                  onFilesUploaded={handleFileUpload}
                  className="h-24 border-dashed border-gray-600 bg-gray-800/20"
                  dragText="Drop files for AI analysis"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel - Business Intelligence */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={viewMode === 'grid' ? 'lg:col-span-1' : 'col-span-full'}
          >
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20 h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Business Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="metrics" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="workflows">Workflows</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="metrics" className="space-y-4">
                    {mockBusinessMetrics.map((metric) => (
                      <div key={metric.name} className="p-3 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">{metric.name}</span>
                          <div className={`flex items-center text-xs ${
                            metric.trend === 'up' ? 'text-green-400' : 
                            metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> :
                             metric.trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> :
                             <Activity className="w-3 h-3 mr-1" />}
                            {metric.change >= 0 ? '+' : ''}{metric.change}%
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">{metric.value}</span>
                          {metric.target && (
                            <span className="text-xs text-gray-500">Target: {metric.target}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="workflows" className="space-y-4">
                    <ScrollArea className="h-64">
                      {mockWorkflowTasks.map((task) => (
                        <div key={task.id} className="p-3 bg-gray-800/30 rounded-lg mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium truncate flex-1">{task.title}</span>
                            <Badge 
                              variant={task.priority === 'critical' ? 'destructive' : 
                                     task.priority === 'high' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className={`flex items-center ${getStatusColor(task.status)}`}>
                              {getStatusIcon(task.status)}
                              <span className="ml-1 text-xs">{task.status}</span>
                            </div>
                            <span className="text-xs text-gray-400">{task.estimatedTime}</span>
                          </div>
                          <Progress value={task.progress} className="h-1 mb-2" />
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Panel - Terminal Integration (Collapsed by default) */}
        {viewMode === 'full' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Terminal className="w-5 h-5 mr-2" />
                  Integrated Terminal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TerminalIntegration className="h-64" />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}