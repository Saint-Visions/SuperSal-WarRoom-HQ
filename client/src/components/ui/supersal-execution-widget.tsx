import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ExecutionLogEntry {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  color: string;
  details: string;
}

interface ExecutionSummary {
  activeTasks: number;
  completedTasks: number;
  totalTasks: number;
  dailyRevenue: number;
  revenueGoal: number;
  completionRate: number;
}

export default function SuperSalExecutionWidget() {
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const queryClient = useQueryClient();

  // Fetch execution data
  const { data: executionData } = useQuery({
    queryKey: ['/api/supersal/execution'],
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('/api/supersal/execution/chat', {
        method: 'POST',
        body: { message },
      });
    },
    onSuccess: (data) => {
      setChatResponse(data.response);
      setTimeout(() => setChatResponse(""), 5000); // Clear response after 5 seconds
    },
  });

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      chatMutation.mutate(chatInput);
      setChatInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleChatSubmit();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'cyan': return 'text-cyan-400';
      case 'green': return 'text-green-400';
      case 'yellow': return 'text-yellow-400';
      case 'purple': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const executionLog: ExecutionLogEntry[] = executionData?.executionLog || [];
  const summary: ExecutionSummary = executionData?.summary || {
    activeTasks: 5,
    completedTasks: 7,
    totalTasks: 12,
    dailyRevenue: 2800,
    revenueGoal: 4000,
    completionRate: 58
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center text-cyan-400">
          <MessageSquare className="w-5 h-5 mr-2" />
          SuperSal Execution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Execution Log */}
        <div className="h-32 bg-gray-900/50 rounded-lg p-3 overflow-y-auto text-xs space-y-2">
          {executionLog.map((entry) => (
            <div key={entry.id} className={getColorClass(entry.color)}>
              <span className="text-gray-400">[{formatTime(entry.timestamp)}]</span> {entry.message}
            </div>
          ))}
        </div>

        {/* Chat Interface */}
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Ask SuperSal..." 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={chatMutation.isPending}
            className="flex-1 bg-gray-900/50 border border-gray-600 rounded px-2 py-1 text-xs text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none disabled:opacity-50"
          />
          <Button 
            size="sm" 
            onClick={handleChatSubmit}
            disabled={chatMutation.isPending || !chatInput.trim()}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 px-3"
          >
            {chatMutation.isPending ? "..." : "→"}
          </Button>
        </div>

        {/* Chat Response */}
        {chatResponse && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2">
            <p className="text-xs text-cyan-300">{chatResponse}</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>Active: {summary.activeTasks} tasks</span>
          <span>Completed: {summary.completedTasks}/{summary.totalTasks}</span>
        </div>
      </CardContent>
    </Card>
  );
}