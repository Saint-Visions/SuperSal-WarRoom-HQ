import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  GitBranch, 
  Play, 
  Save, 
  Database, 
  Webhook, 
  FolderSync, 
  BarChart3,
  Terminal,
  Trash2,
  Code,
  Settings,
  TestTube,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WorkflowNode {
  id: string;
  type: "trigger" | "process" | "decision" | "action" | "end";
  x: number;
  y: number;
  data: {
    title: string;
    description: string;
    config?: any;
  };
}

interface WorkflowConnection {
  from: string;
  to: string;
}

const nodeTypes = [
  { type: "trigger", label: "Trigger", icon: Play, color: "bg-green-500" },
  { type: "process", label: "Process", icon: Settings, color: "bg-blue-500" },
  { type: "decision", label: "Decision", icon: GitBranch, color: "bg-yellow-500" },
  { type: "action", label: "Action", icon: Wrench, color: "bg-purple-500" },
  { type: "end", label: "End", icon: Trash2, color: "bg-red-500" },
];

const quickActions = [
  { id: "query-supabase", label: "Query Supabase", icon: Database },
  { id: "test-webhook", label: "Test Webhook", icon: Webhook },
  { id: "sync-ghl", label: "FolderSync GHL Data", icon: FolderSync },
  { id: "generate-report", label: "Generate Report", icon: BarChart3 },
];

export default function DevLabScreen() {
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>([
    {
      id: "start",
      type: "trigger",
      x: 20,
      y: 20,
      data: { title: "Start", description: "Webhook Trigger" }
    },
    {
      id: "process",
      type: "process", 
      x: 180,
      y: 20,
      data: { title: "Process", description: "Parse Lead Data" }
    },
    {
      id: "decision",
      type: "decision",
      x: 340,
      y: 20,
      data: { title: "Decision", description: "Lead Quality?" }
    },
    {
      id: "action",
      type: "action",
      x: 340,
      y: 120,
      data: { title: "Action", description: "Send to CRM" }
    }
  ]);

  const [connections, setConnections] = useState<WorkflowConnection[]>([
    { from: "start", to: "process" },
    { from: "process", to: "decision" },
    { from: "decision", to: "action" }
  ]);

  const [terminalOutput, setTerminalOutput] = useState([
    "supersal@warroom:~$ status",
    "✓ All systems operational",
    "✓ GHL API connected", 
    "✓ Stripe webhooks active",
    "✓ Azure services online",
    "supersal@warroom:~$ sync --all",
    "Syncing calendar events... done",
    "Updating lead pipeline... done",
    "Refreshing KPI metrics... done",
    "supersal@warroom:~$ "
  ]);

  const [apiTestMethod, setApiTestMethod] = useState("GET");
  const [apiTestUrl, setApiTestUrl] = useState("");
  const [apiTestResponse, setApiTestResponse] = useState("");
  const [terminalCommand, setTerminalCommand] = useState("");

  const { toast } = useToast();

  const workflowMutation = useMutation({
    mutationFn: async (workflow: any) => {
      const response = await apiRequest("POST", "/api/workflows", workflow);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const apiTestMutation = useMutation({
    mutationFn: async ({ method, url }: { method: string; url: string }) => {
      const response = await apiRequest("POST", "/api/external/test", {
        method,
        url,
        headers: { "Content-Type": "application/json" }
      });
      return response.json();
    },
    onSuccess: (data) => {
      setApiTestResponse(JSON.stringify(data, null, 2));
      toast({
        title: "API Test Complete",
        description: `Status: ${data.status}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "API Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const quickActionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      // Simulate different quick actions
      switch (actionId) {
        case "query-supabase":
          return apiRequest("GET", "/api/dashboard");
        case "test-webhook": 
          return apiRequest("POST", "/api/external/test", {
            method: "POST",
            url: "https://webhook.site/test"
          });
        case "sync-ghl":
          return apiRequest("GET", "/api/ghl/contacts");
        case "generate-report":
          return apiRequest("GET", "/api/kpi-metrics");
        default:
          throw new Error("Unknown action");
      }
    },
    onSuccess: () => {
      const newOutput = [...terminalOutput, `✓ Action completed successfully`];
      setTerminalOutput(newOutput);
    },
    onError: (error: any) => {
      const newOutput = [...terminalOutput, `✗ Error: ${error.message}`];
      setTerminalOutput(newOutput);
    },
  });

  const saveWorkflow = () => {
    const workflow = {
      name: "Lead Processing Workflow",
      description: "Automated lead processing and CRM integration",
      definition: {
        nodes: workflowNodes,
        connections
      },
      triggerType: "webhook"
    };
    workflowMutation.mutate(workflow);
  };

  const runApiTest = () => {
    if (!apiTestUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid API endpoint",
        variant: "destructive",
      });
      return;
    }
    apiTestMutation.mutate({ method: apiTestMethod, url: apiTestUrl });
  };

  const executeCommand = () => {
    if (!terminalCommand.trim()) return;
    
    const newOutput = [...terminalOutput, `supersal@warroom:~$ ${terminalCommand}`];
    
    // Simulate command responses
    switch (terminalCommand.toLowerCase()) {
      case "status":
        newOutput.push("✓ All systems operational");
        break;
      case "sync":
        newOutput.push("Syncing all services... done");
        break;
      case "clear":
        setTerminalOutput(["supersal@warroom:~$ "]);
        setTerminalCommand("");
        return;
      default:
        newOutput.push(`Command not found: ${terminalCommand}`);
    }
    
    newOutput.push("supersal@warroom:~$ ");
    setTerminalOutput(newOutput);
    setTerminalCommand("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Builder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center">
                <GitBranch className="w-5 h-5 text-primary mr-2" />
                Workflow Builder
              </CardTitle>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-primary/20 text-primary hover:bg-primary/30"
                  disabled={workflowMutation.isPending}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Run
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={saveWorkflow}
                  disabled={workflowMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>

            {/* Workflow Canvas */}
            <div className="workflow-canvas">
              {workflowNodes.map((node) => {
                const nodeType = nodeTypes.find(t => t.type === node.type);
                return (
                  <motion.div
                    key={node.id}
                    className={`workflow-node ${node.type}`}
                    style={{ left: node.x, top: node.y }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-xs font-medium text-center">
                      {nodeType?.icon && <nodeType.icon className="w-3 h-3 mx-auto mb-1" />}
                      {node.data.title}
                    </div>
                    <div className="text-xs text-center opacity-80">
                      {node.data.description}
                    </div>
                  </motion.div>
                );
              })}

              {/* Connection Lines */}
              <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="hsl(45, 84%, 55%)" />
                  </marker>
                </defs>
                {connections.map((conn, index) => {
                  const fromNode = workflowNodes.find(n => n.id === conn.from);
                  const toNode = workflowNodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  
                  return (
                    <line
                      key={index}
                      x1={fromNode.x + 64}
                      y1={fromNode.y + 24}
                      x2={toNode.x}
                      y2={toNode.y + 24}
                      stroke="hsl(45, 84%, 55%)"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Node Palette */}
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {nodeTypes.map((nodeType) => (
                <motion.div
                  key={nodeType.type}
                  className={`${nodeType.color} rounded p-2 text-xs whitespace-nowrap cursor-pointer text-white`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <nodeType.icon className="w-3 h-3 mr-1 inline" />
                  {nodeType.label}
                </motion.div>
              ))}
            </div>
          </GlassmorphismCard>
        </motion.div>

        {/* Tools Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassmorphismCard className="p-4">
            <CardTitle className="mb-4 flex items-center">
              <Wrench className="w-5 h-5 text-primary mr-2" />
              Dev Tools
            </CardTitle>

            {/* API Tester */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">API Tester</h4>
                <div className="space-y-2">
                  <Select value={apiTestMethod} onValueChange={setApiTestMethod}>
                    <SelectTrigger className="bg-white/10 border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="API Endpoint..."
                    value={apiTestUrl}
                    onChange={(e) => setApiTestUrl(e.target.value)}
                    className="bg-white/10 border-0"
                  />
                  <Button
                    onClick={runApiTest}
                    disabled={apiTestMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
                  >
                    <TestTube className="w-4 h-4 mr-1" />
                    Send Request
                  </Button>
                </div>
                {apiTestResponse && (
                  <Textarea
                    value={apiTestResponse}
                    readOnly
                    className="mt-2 bg-charcoal font-mono text-xs h-32"
                  />
                )}
              </div>

              {/* Code Sandbox */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Code Sandbox</h4>
                <div className="bg-charcoal rounded-lg p-3 font-mono text-xs">
                  <div className="text-green-400"># Quick Python REPL</div>
                  <div className="text-white">{'>>>'} print("Hello SuperSal!")</div>
                  <div className="text-blue-400">Hello SuperSal!</div>
                  <div className="text-white">{'>>>'} _</div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-2 hover:bg-white/20"
                >
                  <Code className="w-4 h-4 mr-1" />
                  Open Full Editor
                </Button>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      className="w-full justify-start text-sm hover:bg-white/10"
                      onClick={() => quickActionMutation.mutate(action.id)}
                      disabled={quickActionMutation.isPending}
                    >
                      <action.icon className="w-4 h-4 text-primary mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.div>
      </div>

      {/* Terminal & Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassmorphismCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center">
              <Terminal className="w-5 h-5 text-primary mr-2" />
              CLI Terminal
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTerminalOutput(["supersal@warroom:~$ "])}
            >
              Clear
            </Button>
          </div>

          <div className="terminal">
            {terminalOutput.map((line, index) => (
              <div
                key={index}
                className={
                  line.startsWith("supersal@warroom:~$")
                    ? "terminal-prompt"
                    : line.startsWith("✓")
                    ? "terminal-output"
                    : line.startsWith("✗")
                    ? "text-red-400"
                    : "terminal-info"
                }
              >
                {line}
                {index === terminalOutput.length - 1 && line.endsWith("$ ") && (
                  <span className="terminal-cursor">_</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-2 mt-4">
            <span className="text-green-400 font-mono text-sm">supersal@warroom:~$</span>
            <Input
              value={terminalCommand}
              onChange={(e) => setTerminalCommand(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && executeCommand()}
              className="flex-1 bg-transparent border-0 font-mono text-sm focus:ring-0"
              placeholder="Enter command..."
            />
          </div>
        </GlassmorphismCard>
      </motion.div>
    </motion.div>
  );
}
