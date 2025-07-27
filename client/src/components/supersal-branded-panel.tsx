import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Bot, Zap, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function SuperSalBrandedPanel() {
  // System Status Query
  const { data: systemStatus, isLoading } = useQuery({
    queryKey: ['/api/supersal/system-status'],
    refetchInterval: 10000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'degraded': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <XCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="col-span-1"
    >
      <Card className="bg-black/40 backdrop-blur-xl border-primary/20 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-primary">
            <div className="relative">
              <Bot className="w-5 h-5 mr-2" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            SuperSal Authority
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SaintSal + You Branding */}
          <div className="text-center py-6">
            <div 
              className="w-20 h-20 mx-auto mb-3 bg-cover bg-center rounded-lg opacity-90 hover:opacity-100 transition-opacity border-2 border-primary/20"
              style={{
                backgroundImage: `url('/attached_assets/Frame 1000002501_1753620834045.png')`,
                backgroundSize: 'cover'
              }}
            />
            <h3 className="text-lg font-bold text-primary mb-1">saintsal™</h3>
            <p className="text-xs text-gray-400">+ you</p>
          </div>

          {/* System Status */}
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : systemStatus ? (
            <div className="space-y-3">
              <Badge className={`w-full justify-center ${getStatusColor(systemStatus.status)}`}>
                {getStatusIcon(systemStatus.status)}
                <span className="ml-2 capitalize">{systemStatus.status}</span>
              </Badge>
              
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium">System Health</p>
                {systemStatus.systems?.details?.slice(0, 3).map((detail: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                      detail.startsWith('✓') ? 'bg-green-400' : 'bg-yellow-400'
                    }`} />
                    <p className="text-xs text-gray-300 leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Shield className="w-8 h-8 mx-auto text-gray-600 mb-2" />
              <p className="text-xs text-gray-400">System check unavailable</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-3 border-t border-gray-800">
            <Button 
              size="sm" 
              className="w-full bg-primary hover:bg-primary/80 text-black"
            >
              <Zap className="w-4 h-4 mr-2" />
              Run Full Audit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}