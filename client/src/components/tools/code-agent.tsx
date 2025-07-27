import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  Code,
  FileText,
  Send,
  Upload,
  Zap,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CodeAgent() {
  const [prompt, setPrompt] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const codeAgentMutation = useMutation({
    mutationFn: async (data: { action: string; prompt?: string; code?: string }) => {
      const response = await apiRequest('/api/tools/code-agent', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      setResult(data);
      setIsAnalyzing(false);
      toast({
        title: "Code Agent Complete",
        description: "Analysis and recommendations ready",
      });
    },
    onError: (error) => {
      console.error('Code Agent error:', error);
      setIsAnalyzing(false);
      toast({
        title: "Code Agent Error",
        description: "Failed to process request",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!prompt.trim() && !codeInput.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    codeAgentMutation.mutate({
      action: 'analyze',
      prompt: prompt.trim(),
      code: codeInput.trim()
    });
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    codeAgentMutation.mutate({
      action: 'generate',
      prompt: prompt.trim()
    });
  };

  const handleOptimize = () => {
    if (!codeInput.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    codeAgentMutation.mutate({
      action: 'optimize',
      code: codeInput.trim()
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Code Agent Input Panel */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Brain className="w-5 h-5" />
            AI Code Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Describe what you want to build or analyze
            </label>
            <Textarea
              placeholder="e.g., Create a React component for user authentication, or analyze this function for performance issues..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white min-h-[100px]"
            />
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Paste existing code (optional)
            </label>
            <Textarea
              placeholder="Paste your code here for analysis or optimization..."
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white font-mono text-sm min-h-[200px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Code
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={(!prompt.trim() && !codeInput.trim()) || isAnalyzing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Analyze
            </Button>
            <Button
              onClick={handleOptimize}
              disabled={!codeInput.trim() || isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Optimize
            </Button>
          </div>

          {/* Loading State */}
          {isAnalyzing && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mr-3"></div>
              <span className="text-slate-300">AI processing your request...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Code className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              {/* Analysis Results */}
              {result.analysis && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Analysis</h4>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-300 whitespace-pre-wrap">{result.analysis}</p>
                  </div>
                </div>
              )}

              {/* Generated Code */}
              {result.code && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Generated Code</h4>
                  <div className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-green-400 font-mono text-sm">
                      <code>{result.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-slate-800/30 rounded-lg">
                        {rec.type === 'improvement' ? (
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-slate-200 font-medium">{rec.title}</p>
                          <p className="text-slate-400 text-sm">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              {result.metrics && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(result.metrics).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-slate-400 text-sm capitalize">{key.replace('_', ' ')}</p>
                        <p className="text-white font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Submit a request to see AI analysis and recommendations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}