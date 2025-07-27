import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Loader2,
  Terminal,
  Bot
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AuditResult {
  audit: {
    taskName: string;
    targetPage: string;
    overallStatus: 'operational' | 'degraded' | 'critical';
    checks: Record<string, { status: 'pass' | 'fail' | 'warning'; details: string[] }>;
    actionItems: string[];
  };
  response: string;
  timestamp: string;
}

export default function SuperSalAuthorityPanel() {
  const [auditParams, setAuditParams] = useState({
    taskName: '',
    targetPage: '',
    criticalSystems: 'database,openai,azure,stripe,ghl,microsoft'
  });

  const queryClient = useQueryClient();

  // System Status Query
  const { data: systemStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/supersal/system-status'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Audit Mutation
  const auditMutation = useMutation({
    mutationFn: async (params: typeof auditParams) => {
      const response = await apiRequest('/api/supersal/audit', {
        method: 'POST',
        body: JSON.stringify({
          ...params,
          criticalSystems: params.criticalSystems.split(',').map(s => s.trim())
        })
      });
      return response as AuditResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/supersal/system-status'] });
    }
  });

  const handleAudit = () => {
    if (!auditParams.taskName || !auditParams.targetPage) return;
    auditMutation.mutate(auditParams);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'degraded':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'critical':
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'pass':
        return 'border-green-400 bg-green-400/10';
      case 'degraded':
      case 'warning':
        return 'border-yellow-400 bg-yellow-400/10';
      case 'critical':
      case 'fail':
        return 'border-red-400 bg-red-400/10';
      default:
        return 'border-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <Shield className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-cyan-400">SuperSal™ Functional Authority</h2>
          <p className="text-sm text-gray-400">Divine-level system audit & verification</p>
        </div>
      </motion.div>

      {/* System Status Overview */}
      <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center text-cyan-400">
            <Terminal className="w-5 h-5 mr-2" />
            System Status
            {statusLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {systemStatus && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Status</span>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(systemStatus.status)}
                >
                  {getStatusIcon(systemStatus.status)}
                  <span className="ml-2 capitalize">{systemStatus.status}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {systemStatus.systems?.details?.map((detail: string, index: number) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border text-xs ${
                      detail.includes('✓') ? 'border-green-400/20 bg-green-400/5' :
                      detail.includes('⚠') ? 'border-yellow-400/20 bg-yellow-400/5' :
                      'border-red-400/20 bg-red-400/5'
                    }`}
                  >
                    {detail}
                  </div>
                )) || (
                  <div className="col-span-2 text-center text-gray-400 py-4">
                    Loading system details...
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Functional Audit Interface */}
      <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Bot className="w-5 h-5 mr-2" />
            Run Functional Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="taskName" className="text-sm font-medium text-gray-300">
                Task Name
              </Label>
              <Input
                id="taskName"
                placeholder="e.g., War Room Enhancement"
                value={auditParams.taskName}
                onChange={(e) => setAuditParams(prev => ({ ...prev, taskName: e.target.value }))}
                className="bg-gray-800/50 border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="targetPage" className="text-sm font-medium text-gray-300">
                Target Page/System
              </Label>
              <Input
                id="targetPage"
                placeholder="e.g., /warroom or Command Center"
                value={auditParams.targetPage}
                onChange={(e) => setAuditParams(prev => ({ ...prev, targetPage: e.target.value }))}
                className="bg-gray-800/50 border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="criticalSystems" className="text-sm font-medium text-gray-300">
                Critical Systems (comma-separated)
              </Label>
              <Textarea
                id="criticalSystems"
                placeholder="database,openai,azure,stripe,ghl,microsoft"
                value={auditParams.criticalSystems}
                onChange={(e) => setAuditParams(prev => ({ ...prev, criticalSystems: e.target.value }))}
                className="bg-gray-800/50 border-gray-600 h-20"
              />
            </div>
          </div>

          <Button
            onClick={handleAudit}
            disabled={auditMutation.isPending || !auditParams.taskName || !auditParams.targetPage}
            className="w-full bg-primary hover:bg-primary/80"
          >
            {auditMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Audit...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Execute SuperSal Audit
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Audit Results */}
      {auditMutation.data && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <CheckCircle className="w-5 h-5 mr-2" />
                Audit Complete: {auditMutation.data.audit.taskName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* SuperSal Response */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-500/20">
                <h4 className="font-medium text-cyan-400 mb-2">SuperSal™ Response:</h4>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {auditMutation.data.response}
                </pre>
              </div>

              {/* Overall Status */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Status:</span>
                <Badge 
                  variant="outline"
                  className={getStatusColor(auditMutation.data.audit.overallStatus)}
                >
                  {getStatusIcon(auditMutation.data.audit.overallStatus)}
                  <span className="ml-2 capitalize">
                    {auditMutation.data.audit.overallStatus}
                  </span>
                </Badge>
              </div>

              {/* Action Items */}
              {auditMutation.data.audit.actionItems.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-400 mb-2">Action Items:</h4>
                  <ul className="space-y-1">
                    {auditMutation.data.audit.actionItems.map((item, index) => (
                      <li key={index} className="text-sm text-gray-300 flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed Checks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(auditMutation.data.audit.checks).map(([checkName, check]) => (
                  <div 
                    key={checkName}
                    className={`p-3 rounded-lg border ${getStatusColor(check.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {checkName.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {getStatusIcon(check.status)}
                    </div>
                    <div className="space-y-1">
                      {check.details.slice(0, 2).map((detail, index) => (
                        <div key={index} className="text-xs text-gray-400">
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error Display */}
      {auditMutation.isError && (
        <Card className="bg-red-900/20 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-400">
              <XCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Audit Failed</span>
            </div>
            <p className="text-sm text-red-300 mt-2">
              {auditMutation.error?.message || 'Unknown error occurred'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}