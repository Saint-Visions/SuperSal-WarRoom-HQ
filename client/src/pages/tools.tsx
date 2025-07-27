import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench,
  Database,
  Globe,
  Zap,
  Brain,
  Shield,
  BarChart3,
  Activity,
  Target,
  Settings,
  MessageSquare,
  Calendar,
  Users,
  StickyNote,
  Terminal,
  Code,
  Upload,
  Phone,
  Mail,
  Mic,
  Camera,
  FileText,
  Search,
  Filter
} from "lucide-react";
import StickyNotes from "@/components/ui/sticky-notes";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Tools() {
  const [activeCategory, setActiveCategory] = useState("productivity");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const { toast } = useToast();

  // Tool categories with all integrated tools
  const toolCategories = {
    productivity: {
      name: "Productivity",
      icon: Target,
      color: "text-cyan-400",
      tools: [
        { id: "sticky-notes", name: "Sticky Notes", icon: StickyNote, description: "Create and manage sticky notes, contacts, reminders" },
        { id: "calendar", name: "Calendar", icon: Calendar, description: "Microsoft Calendar integration and event management" },
        { id: "contacts", name: "Contacts", icon: Users, description: "Contact management with CRM sync" },
        { id: "tasks", name: "Task Manager", icon: Target, description: "Task creation and tracking system" },
        { id: "terminal", name: "Terminal", icon: Terminal, description: "Command line interface integration" },
        { id: "file-upload", name: "File Manager", icon: Upload, description: "Drag & drop file handling with AI analysis" }
      ]
    },
    communication: {
      name: "Communication",
      icon: MessageSquare,
      color: "text-blue-400",
      tools: [
        { id: "chat", name: "AI Chat", icon: MessageSquare, description: "OpenAI GPT-4o powered conversations" },
        { id: "email", name: "Email", icon: Mail, description: "Email automation and management" },
        { id: "sms", name: "SMS", icon: Phone, description: "Twilio SMS integration" },
        { id: "voice", name: "Voice", icon: Mic, description: "Azure speech-to-text and text-to-speech" },
        { id: "video", name: "Video Calls", icon: Camera, description: "Video conferencing integration" }
      ]
    },
    analytics: {
      name: "Analytics",
      icon: BarChart3,
      color: "text-green-400",
      tools: [
        { id: "dashboard", name: "Dashboard", icon: BarChart3, description: "Real-time business intelligence" },
        { id: "reports", name: "Reports", icon: FileText, description: "Generate business reports" },
        { id: "metrics", name: "KPI Metrics", icon: Activity, description: "Key performance indicators tracking" },
        { id: "search", name: "Search", icon: Search, description: "Advanced data search and filtering" }
      ]
    },
    integrations: {
      name: "Integrations",
      icon: Globe,
      color: "text-purple-400",
      tools: [
        { id: "ghl", name: "GoHighLevel", icon: Database, description: "CRM and lead management" },
        { id: "stripe", name: "Stripe", icon: Shield, description: "Payment processing and billing" },
        { id: "azure", name: "Azure Services", icon: Brain, description: "Microsoft cognitive services" },
        { id: "microsoft", name: "Microsoft Graph", icon: Globe, description: "Microsoft 365 integration" }
      ]
    },
    automation: {
      name: "Automation",
      icon: Zap,
      color: "text-yellow-400",
      tools: [
        { id: "workflows", name: "Workflows", icon: Zap, description: "Automated business processes" },
        { id: "ai-tasks", name: "AI Task Generation", icon: Brain, description: "Intelligent task creation" },
        { id: "scheduling", name: "Scheduling", icon: Calendar, description: "Automated appointment booking" },
        { id: "lead-scoring", name: "Lead Scoring", icon: Target, description: "AI-powered lead qualification" }
      ]
    },
    development: {
      name: "Development",
      icon: Code,
      color: "text-orange-400",
      tools: [
        { id: "vscode", name: "VS Code", icon: Code, description: "Integrated development environment" },
        { id: "database", name: "Database", icon: Database, description: "PostgreSQL database management" },
        { id: "api", name: "API Testing", icon: Globe, description: "REST API testing and monitoring" },
        { id: "logs", name: "System Logs", icon: FileText, description: "Application logging and debugging" }
      ]
    }
  };

  // Execute tool action mutation
  const executeToolMutation = useMutation({
    mutationFn: async (data: { toolId: string; action: string; params?: any }) => {
      return apiRequest('/api/tools/execute', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Tool Executed",
        description: data.result || "Action completed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Tool Error",
        description: error.message || "Failed to execute tool",
        variant: "destructive",
      });
    },
  });

  const handleToolAction = (toolId: string, action: string = "execute", params?: any) => {
    executeToolMutation.mutate({ toolId, action, params });
  };

  return (
    <div className="min-h-screen bg-charcoal text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-black">Sv.</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">SuperSal™ Tools</h1>
                <p className="text-gray-400">
                  Comprehensive toolkit with all integrated systems and functionality
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {Object.entries(toolCategories).map(([key, category]) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={key}
                  variant={activeCategory === key ? "default" : "outline"}
                  onClick={() => setActiveCategory(key)}
                  className={`${category.color} ${
                    activeCategory === key 
                      ? 'bg-primary/20 border-primary' 
                      : 'border-gray-600 hover:border-primary/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Special Sticky Notes Section */}
        {activeCategory === "productivity" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <StickyNotes />
          </motion.div>
        )}

        {/* Tools Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toolCategories[activeCategory as keyof typeof toolCategories].tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="bg-black/40 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-300 group cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`w-5 h-5 ${toolCategories[activeCategory as keyof typeof toolCategories].color}`} />
                          <span className="text-white group-hover:text-primary transition-colors">
                            {tool.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleToolAction(tool.id, "execute")}
                          disabled={executeToolMutation.isPending}
                          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                        >
                          Execute
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToolAction(tool.id, "status")}
                          className="border-gray-600 hover:border-primary/50"
                        >
                          Status
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Activity className="w-5 h-5 mr-2" />
                Tool Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">
                    {Object.values(toolCategories).reduce((acc, cat) => acc + cat.tools.length, 0)}
                  </p>
                  <p className="text-xs text-gray-400">Total Tools</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {Object.keys(toolCategories).length}
                  </p>
                  <p className="text-xs text-gray-400">Categories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">11</p>
                  <p className="text-xs text-gray-400">Integrations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">100%</p>
                  <p className="text-xs text-gray-400">Operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}