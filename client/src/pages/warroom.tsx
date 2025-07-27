import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Cpu, 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  MessageSquare,
  Search,
  Wrench,
  Globe,
  Database
} from "lucide-react";

export default function WarRoom() {
  const [companionMode, setCompanionMode] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState([]);

  // Fetch system status
  const { data: systemStatus } = useQuery({
    queryKey: ['/api/system/status'],
    refetchInterval: 5000, // Update every 5 seconds
  });

  // Fetch KPIs
  const { data: kpiData } = useQuery({
    queryKey: ['/api/dashboard'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  const services = [
    { name: "Azure", status: "connected", icon: Globe, color: "text-blue-400" },
    { name: "Stripe", status: "live", icon: Database, color: "text-green-400" },
    { name: "GHL", status: "mock", icon: Activity, color: "text-yellow-400" },
    { name: "Twilio", status: "active", icon: MessageSquare, color: "text-purple-400" },
  ];

  const emergencyActions = [
    { id: "wipe_memory", label: "Wipe Memory", icon: XCircle, variant: "destructive" as const },
    { id: "restart_agent", label: "Restart Agent", icon: Cpu, variant: "secondary" as const },
    { id: "lock_mode", label: "Lock Mode", icon: Shield, variant: "outline" as const },
    { id: "audit_fail", label: "Audit Fail", icon: AlertTriangle, variant: "outline" as const },
  ];

  return (
    <div className="min-h-screen bg-charcoal text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">SuperSal™ War Room HQ</h1>
          <p className="text-gray-400">Bruce Wayne Build • Mission Operations Center</p>
        </motion.div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Panel: Mission Ops */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* SuperSal Status */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Cpu className="w-5 h-5 mr-2" />
                  SuperSal Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Model</span>
                  <Badge variant="secondary">GPT-4o</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mode</span>
                  <Badge variant={companionMode ? "default" : "outline"}>
                    {companionMode ? "Companion" : "Client"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Latency</span>
                  <Badge variant="secondary">124ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companion Switcher */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Zap className="w-5 h-5 mr-2" />
                  Companion Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {companionMode ? "Companion Mode" : "Client Mode"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {companionMode 
                        ? "Personal AI Assistant Active" 
                        : "Client Service Mode Active"
                      }
                    </p>
                  </div>
                  <Switch
                    checked={companionMode}
                    onCheckedChange={setCompanionMode}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Controls */}
            <Card className="bg-black/40 backdrop-blur-xl border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-red-400">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {emergencyActions.map((action) => (
                    <Button
                      key={action.id}
                      variant={action.variant}
                      size="sm"
                      className="h-auto py-2 text-xs"
                    >
                      <action.icon className="w-3 h-3 mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Status */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Activity className="w-5 h-5 mr-2" />
                  Service Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <service.icon className={`w-4 h-4 mr-2 ${service.color}`} />
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <Badge variant="outline" className={service.color}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Panel: Intel Hub */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* KPI Metrics */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Live Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">342</p>
                    <p className="text-xs text-gray-400">Active Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">25%</p>
                    <p className="text-xs text-gray-400">Conversion</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">$25.8K</p>
                    <p className="text-xs text-gray-400">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">1,450</p>
                    <p className="text-xs text-gray-400">Contacts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deploy Status */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Wrench className="w-5 h-5 mr-2" />
                  Deploy & Fix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/80 text-black">
                  Run Fix Audit
                </Button>
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-green-400">Last Deploy: Success</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </CardContent>
            </Card>

            {/* Search Index */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Search className="w-5 h-5 mr-2" />
                  Search Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Terms</span>
                    <Badge variant="secondary">2,847</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update</span>
                    <span className="text-gray-400">5m ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <Badge variant="default" className="text-green-400">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel: Mind Console */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Lead Intelligence Integration */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20 h-96">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-primary">
                  <div className="flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    PartnerTech.ai
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/80 text-black"
                    onClick={() => window.location.href = '/leads'}
                  >
                    Launch AI
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">847</p>
                    <p className="text-xs text-gray-400">Total Leads</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">92</p>
                    <p className="text-xs text-gray-400">High Intent</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>PartnerTech Engine</span>
                    <Badge variant="outline" className="text-green-400">Online</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Intent Detection</span>
                    <Badge variant="outline" className="text-green-400">Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Data Enrichment</span>
                    <Badge variant="outline" className="text-primary">SuperSal™</Badge>
                  </div>
                </div>
                <Button className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Ask PartnerTech.ai
                </Button>
              </CardContent>
            </Card>

            {/* Memory Debugger */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Database className="w-5 h-5 mr-2" />
                  Memory Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                  <div className="bg-gray-800 p-2 rounded text-xs">
                    Vector chunk: "business operations manual..."
                  </div>
                  <div className="bg-gray-800 p-2 rounded text-xs">
                    Vector chunk: "CRM integration protocols..."
                  </div>
                  <div className="bg-gray-800 p-2 rounded text-xs">
                    Vector chunk: "AI response templates..."
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sticky SuperSal Companion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Card className="bg-primary/90 backdrop-blur-xl border-primary w-64">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-black font-medium text-sm">SuperSal™</p>
                  <p className="text-black/70 text-xs">
                    War Room systems nominal. Ready for commands.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}