import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Shield,
  Bug,
  AlertTriangle,
  CheckCircle,
  Search,
  Zap,
  Terminal,
  FileText,
  RefreshCw,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CodeBreaker() {
  const [errorInput, setErrorInput] = useState("");
  const [stackTrace, setStackTrace] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const { toast } = useToast();

  const codeBreakerMutation = useMutation({
    mutationFn: async (data: { action: string; error?: string; stackTrace?: string; code?: string }) => {
      const response = await apiRequest('/api/tools/code-breaker', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (data) => {
      setResult(data);
      setIsDebugging(false);
      toast({
        title: "Code Breaker Complete",
        description: "Debug analysis and fixes ready",
      });
    },
    onError: (error) => {
      console.error('Code Breaker error:', error);
      setIsDebugging(false);
      toast({
        title: "Code Breaker Error",
        description: "Failed to analyze the issue",
        variant: "destructive",
      });
    },
  });

  const handleDebugError = () => {
    if (!errorInput.trim()) return;
    
    setIsDebugging(true);
    setResult(null);
    
    codeBreakerMutation.mutate({
      action: 'debug_error',
      error: errorInput.trim(),
      stackTrace: stackTrace.trim(),
      code: codeSnippet.trim()
    });
  };

  const handleSecurityScan = () => {
    if (!codeSnippet.trim()) return;
    
    setIsDebugging(true);
    setResult(null);
    
    codeBreakerMutation.mutate({
      action: 'security_scan',
      code: codeSnippet.trim()
    });
  };

  const handlePerformanceAudit = () => {
    if (!codeSnippet.trim()) return;
    
    setIsDebugging(true);
    setResult(null);
    
    codeBreakerMutation.mutate({
      action: 'performance_audit',
      code: codeSnippet.trim()
    });
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30';
      case 'low': return 'text-blue-400 bg-blue-900/20 border-blue-400/30';
      default: return 'text-slate-400 bg-slate-900/20 border-slate-400/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Code Breaker Input Panel */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <Shield className="w-5 h-5" />
            Code Breaker - Debug & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Message Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Error Message or Issue Description
            </label>
            <Textarea
              placeholder="Paste your error message, exception, or describe the issue you're experiencing..."
              value={errorInput}
              onChange={(e) => setErrorInput(e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white min-h-[80px]"
            />
          </div>

          {/* Stack Trace Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Stack Trace (optional)
            </label>
            <Textarea
              placeholder="Paste the full stack trace here..."
              value={stackTrace}
              onChange={(e) => setStackTrace(e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white font-mono text-sm min-h-[100px]"
            />
          </div>

          {/* Code Snippet Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Code Snippet
            </label>
            <Textarea
              placeholder="Paste the problematic code or code you want to audit..."
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="bg-slate-800/50 border-slate-600 text-white font-mono text-sm min-h-[150px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleDebugError}
              disabled={!errorInput.trim() || isDebugging}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Bug className="w-4 h-4 mr-2" />
              Debug Error
            </Button>
            <Button
              onClick={handleSecurityScan}
              disabled={!codeSnippet.trim() || isDebugging}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security Scan
            </Button>
            <Button
              onClick={handlePerformanceAudit}
              disabled={!codeSnippet.trim() || isDebugging}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Performance Audit
            </Button>
          </div>

          {/* Loading State */}
          {isDebugging && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-red-400 border-t-transparent rounded-full mr-3"></div>
              <span className="text-slate-300">Analyzing and breaking down the issue...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Target className="w-5 h-5" />
            Debug Results & Fixes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              {/* Issue Summary */}
              {result.summary && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Issue Summary</h4>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-slate-300">{result.summary}</p>
                  </div>
                </div>
              )}

              {/* Root Cause */}
              {result.rootCause && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Root Cause</h4>
                  <div className="bg-red-900/20 border border-red-400/30 p-4 rounded-lg">
                    <p className="text-red-300">{result.rootCause}</p>
                  </div>
                </div>
              )}

              {/* Solutions */}
              {result.solutions && result.solutions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Solutions</h4>
                  <div className="space-y-3">
                    {result.solutions.map((solution: any, idx: number) => (
                      <div key={idx} className="bg-green-900/20 border border-green-400/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="font-medium text-green-300">Solution {idx + 1}</span>
                          {solution.difficulty && (
                            <Badge variant="outline" className="text-xs">
                              {solution.difficulty}
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-300 mb-2">{solution.description}</p>
                        {solution.code && (
                          <div className="bg-slate-900 p-3 rounded-lg mt-2">
                            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                              <code>{solution.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Issues */}
              {result.securityIssues && result.securityIssues.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Security Issues</h4>
                  <div className="space-y-3">
                    {result.securityIssues.map((issue: any, idx: number) => (
                      <div key={idx} className={`border p-4 rounded-lg ${severityColor(issue.severity)}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">{issue.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{issue.description}</p>
                        {issue.fix && (
                          <div className="bg-slate-900/50 p-2 rounded text-sm font-mono">
                            <code>{issue.fix}</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Issues */}
              {result.performanceIssues && result.performanceIssues.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Performance Issues</h4>
                  <div className="space-y-3">
                    {result.performanceIssues.map((issue: any, idx: number) => (
                      <div key={idx} className="bg-purple-900/20 border border-purple-400/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-purple-400" />
                          <span className="font-medium text-purple-300">{issue.title}</span>
                          {issue.impact && (
                            <Badge variant="outline" className="text-xs">
                              {issue.impact} impact
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm">{issue.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Submit an error or code snippet to start debugging</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}