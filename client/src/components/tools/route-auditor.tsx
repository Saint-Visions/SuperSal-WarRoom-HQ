import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Wrench, 
  Globe,
  Clock,
  Activity
} from "lucide-react";

interface RouteAudit {
  id: string;
  url: string;
  method: string;
  status: "success" | "warning" | "error";
  responseTime: number;
  statusCode: number;
  issues: AuditIssue[];
  lastChecked: Date;
}

interface AuditIssue {
  type: "security" | "performance" | "seo" | "accessibility";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  suggestion?: string;
}

export default function RouteAuditor() {
  const [auditUrl, setAuditUrl] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<RouteAudit | null>(null);
  const { toast } = useToast();

  // Mock data for demonstration - in real app this would come from API
  const mockAudits: RouteAudit[] = [
    {
      id: "1",
      url: "/api/dashboard",
      method: "GET",
      status: "success",
      responseTime: 152,
      statusCode: 200,
      issues: [],
      lastChecked: new Date()
    },
    {
      id: "2", 
      url: "/api/chat/completions",
      method: "POST",
      status: "warning",
      responseTime: 2341,
      statusCode: 200,
      issues: [
        {
          type: "performance",
          severity: "medium",
          message: "Slow response time detected",
          suggestion: "Consider implementing caching or optimizing the OpenAI API call"
        }
      ],
      lastChecked: new Date()
    },
    {
      id: "3",
      url: "/api/stripe/payment-intent",
      method: "POST", 
      status: "error",
      responseTime: 0,
      statusCode: 500,
      issues: [
        {
          type: "security",
          severity: "high",
          message: "API key configuration error",
          suggestion: "Verify Stripe secret key is properly configured"
        }
      ],
      lastChecked: new Date()
    }
  ];

  const auditMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/audit/route", { url });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Route Audit Complete",
        description: `Audit completed for ${auditUrl}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audits"] });
    },
    onError: (error: any) => {
      toast({
        title: "Audit Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const fixIssueMutation = useMutation({
    mutationFn: async ({ routeId, issueIndex }: { routeId: string; issueIndex: number }) => {
      const response = await apiRequest("POST", "/api/audit/fix", { routeId, issueIndex });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Issue Fixed",
        description: "Auto-fix applied successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audits"] });
    }
  });

  const runAudit = () => {
    if (!auditUrl.trim()) return;
    auditMutation.mutate(auditUrl);
  };

  const getStatusIcon = (status: RouteAudit["status"]) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "error": return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getSeverityColor = (severity: AuditIssue["severity"]) => {
    switch (severity) {
      case "low": return "text-blue-400";
      case "medium": return "text-yellow-400"; 
      case "high": return "text-orange-400";
      case "critical": return "text-red-400";
    }
  };

  const getTypeIcon = (type: AuditIssue["type"]) => {
    switch (type) {
      case "security": return <Shield className="w-4 h-4" />;
      case "performance": return <Activity className="w-4 h-4" />;
      case "seo": return <Search className="w-4 h-4" />;
      case "accessibility": return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Route Auditor Panel */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold">
            <Shield className="w-5 h-5" />
            Route Auditor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Audit Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter route to audit (e.g., /api/dashboard)"
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              className="bg-surface border-white/20"
              onKeyDown={(e) => e.key === "Enter" && runAudit()}
            />
            <Button 
              onClick={runAudit}
              disabled={auditMutation.isPending}
              className="bg-gold text-charcoal hover:bg-gold/80"
            >
              {auditMutation.isPending ? "Auditing..." : "Audit"}
            </Button>
          </div>

          {/* Recent Audits */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-400">Recent Audits</h4>
            {mockAudits.map((audit) => (
              <div
                key={audit.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedRoute?.id === audit.id 
                    ? "bg-gold/10 border-gold/30" 
                    : "bg-surface/50 border-white/10 hover:border-white/20"
                }`}
                onClick={() => setSelectedRoute(audit)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(audit.status)}
                    <span className="text-sm font-medium">{audit.method} {audit.url}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {audit.responseTime}ms
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Status: {audit.statusCode}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {audit.lastChecked.toLocaleTimeString()}
                  </span>
                  {audit.issues.length > 0 && (
                    <span className="text-yellow-400">{audit.issues.length} issues</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Details & Fix Panel */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gold">
            <Wrench className="w-5 h-5" />
            AuditFix™ Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedRoute ? (
            <div className="space-y-4">
              {/* Route Info */}
              <div className="bg-surface/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{selectedRoute.method} {selectedRoute.url}</span>
                  {getStatusIcon(selectedRoute.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Response Time:</span>
                    <div className="mt-1">
                      <Progress 
                        value={Math.min(selectedRoute.responseTime / 50, 100)} 
                        className="h-2"
                      />
                      <span className="text-xs">{selectedRoute.responseTime}ms</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status Code:</span>
                    <div className={`text-lg font-bold ${
                      selectedRoute.statusCode >= 200 && selectedRoute.statusCode < 300 
                        ? "text-green-400" 
                        : selectedRoute.statusCode >= 400 
                          ? "text-red-400" 
                          : "text-yellow-400"
                    }`}>
                      {selectedRoute.statusCode}
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues */}
              {selectedRoute.issues.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400">Detected Issues</h4>
                  {selectedRoute.issues.map((issue, index) => (
                    <div key={index} className="bg-surface/30 rounded-lg p-3 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(issue.type)}
                          <span className="text-sm font-medium capitalize">{issue.type}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(issue.severity)}`}
                          >
                            {issue.severity}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => fixIssueMutation.mutate({ 
                            routeId: selectedRoute.id, 
                            issueIndex: index 
                          })}
                          disabled={fixIssueMutation.isPending}
                        >
                          Auto-Fix
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{issue.message}</p>
                      {issue.suggestion && (
                        <div className="bg-gold/10 rounded p-2 border border-gold/20">
                          <p className="text-xs text-gold">💡 {issue.suggestion}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
                  <p>No issues detected - route is healthy!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-2" />
              <p>Select a route from the audit list to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}