import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Code, Play, Square, Settings, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TerminalIntegrationProps {
  className?: string;
  embedded?: boolean;
}

export default function TerminalIntegration({ className = "", embedded = false }: TerminalIntegrationProps) {
  const [command, setCommand] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get terminal status and available integrations
  const { data: terminalStatus } = useQuery({
    queryKey: ["/api/terminal/status"],
  });

  const { data: vscodeStatus } = useQuery({
    queryKey: ["/api/vscode/status"],
  });

  const executeCommand = useMutation({
    mutationFn: async (cmd: string) => {
      const response = await apiRequest("POST", "/api/terminal/execute", { command: cmd });
      return response;
    },
    onSuccess: (data) => {
      setOutput(prev => [...prev, `$ ${command}`, data.output || "Command completed"]);
      setCommand("");
      setIsRunning(false);
    },
    onError: (error) => {
      setOutput(prev => [...prev, `$ ${command}`, `Error: ${error.message}`]);
      setIsRunning(false);
      toast({
        title: "Command Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const openVSCode = useMutation({
    mutationFn: async (file?: string) => {
      return await apiRequest("POST", "/api/vscode/open", { file });
    },
    onSuccess: () => {
      toast({
        title: "VS Code Opened",
        description: "VS Code integration launched successfully"
      });
    }
  });

  const handleExecute = () => {
    if (!command.trim()) return;
    
    setIsRunning(true);
    executeCommand.mutate(command);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExecute();
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const quickCommands = [
    { name: "List Files", cmd: "ls -la", icon: Terminal },
    { name: "Git Status", cmd: "git status", icon: Code },
    { name: "NPM Install", cmd: "npm install", icon: Play },
    { name: "System Info", cmd: "uname -a", icon: Settings }
  ];

  if (embedded) {
    return (
      <div className={`bg-black/80 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Terminal</span>
            <Badge variant="outline" className="text-xs">
              {terminalStatus?.connected ? "Connected" : "Offline"}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openVSCode.mutate()}
            className="text-xs"
          >
            <Code className="w-3 h-3 mr-1" />
            VS Code
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter command..."
            className="flex-1 bg-black/50 border-gray-600 text-xs"
            disabled={isRunning}
          />
          <Button
            onClick={handleExecute}
            disabled={isRunning || !command.trim()}
            size="sm"
            className="bg-primary hover:bg-primary/80 text-black"
          >
            {isRunning ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`bg-black/40 backdrop-blur-xl border-primary/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-primary">
          <div className="flex items-center">
            <Terminal className="w-5 h-5 mr-2" />
            Terminal & VS Code Integration
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={terminalStatus?.connected ? "text-green-400" : "text-red-400"}>
              Terminal: {terminalStatus?.connected ? "Online" : "Offline"}
            </Badge>
            <Badge variant="outline" className={vscodeStatus?.available ? "text-green-400" : "text-yellow-400"}>
              VS Code: {vscodeStatus?.available ? "Ready" : "Installing"}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Commands */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickCommands.map((cmd) => (
            <Button
              key={cmd.name}
              size="sm"
              variant="outline"
              onClick={() => setCommand(cmd.cmd)}
              className="text-xs justify-start"
            >
              <cmd.icon className="w-3 h-3 mr-1" />
              {cmd.name}
            </Button>
          ))}
        </div>

        {/* Command Input */}
        <div className="flex space-x-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter terminal command or task description..."
            className="flex-1 bg-white/5 border-gray-600 focus:border-primary"
            disabled={isRunning}
          />
          <Button
            onClick={handleExecute}
            disabled={isRunning || !command.trim()}
            className="bg-primary hover:bg-primary/80 text-black"
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute
              </>
            )}
          </Button>
          <Button
            onClick={() => openVSCode.mutate()}
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
          >
            <Code className="w-4 h-4 mr-2" />
            VS Code
          </Button>
        </div>

        {/* Terminal Output */}
        {(isExpanded || output.length > 0) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-black/60 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto"
            ref={terminalRef}
          >
            {output.length > 0 ? (
              output.map((line, index) => (
                <div
                  key={index}
                  className={line.startsWith('$') ? 'text-primary' : 'text-gray-300'}
                >
                  {line}
                </div>
              ))
            ) : (
              <div className="text-gray-500">Terminal ready. Execute commands above.</div>
            )}
            {isRunning && (
              <div className="text-yellow-400 animate-pulse">Executing...</div>
            )}
          </motion.div>
        )}

        {/* VS Code Integration */}
        <div className="border-t border-gray-600 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">VS Code Integration</span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openVSCode.mutate(".")}
                className="text-xs"
              >
                Open Project
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openVSCode.mutate("package.json")}
                className="text-xs"
              >
                Edit Config
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}