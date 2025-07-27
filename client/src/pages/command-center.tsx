import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Phone,
  Mail,
  Globe,
  Zap,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  LogOut,
  Shield,
  Upload
} from "lucide-react";
import { Link } from "wouter";
import DragDropZone from "@/components/ui/drag-drop-zone";
import TerminalIntegration from "@/components/ui/terminal-integration";

export default function CommandCenter() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  // Fetch tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ['/api/tasks'],
  });

  // Fetch calendar events
  const { data: events = [] } = useQuery({
    queryKey: ['/api/calendar/events'],
  });

  const contacts = dashboardData?.contacts || [];
  const kpiMetrics = dashboardData?.kpiMetrics || [];

  // Saint Vision Group LLC Brokerage Data
  const { data: brokerageData } = useQuery({
    queryKey: ['/api/brokerage/dashboard'],
  });

  const quickActions = [
    { id: "warroom", label: "War Room", icon: Shield, href: "/warroom", color: "bg-red-500/20 text-red-400" },
    { id: "executive", label: "SuperSal Executive", icon: Star, href: "/executive", color: "bg-primary/20 text-primary" },
    { id: "leads", label: "PartnerTech.ai", icon: TrendingUp, href: "/leads", color: "bg-blue-500/20 text-blue-400" },
    { id: "brokerage", label: "Saint Vision Brokerage", icon: Shield, href: "#", color: "bg-purple-500/20 text-purple-400" },
    { id: "new_call", label: "Schedule Call", icon: Phone, color: "bg-green-500/20 text-green-400" },
    { id: "new_contact", label: "Add Contact", icon: Users, color: "bg-orange-500/20 text-orange-400" },
  ];

  const upcomingTasks = tasks.slice(0, 5);
  const upcomingEvents = events.slice(0, 3);

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
              <img 
                src="/cookin-logo.png" 
                alt="Cookin' Knowledge"
                className="w-16 h-16 opacity-80 hover:opacity-100 transition-opacity"
              />
              <div>
                <h1 className="text-4xl font-bold mb-2">Command Center</h1>
                <p className="text-gray-400">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              {action.href ? (
                <Link href={action.href}>
                  <Card className={`bg-black/40 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-colors cursor-pointer ${action.color} h-24`}>
                    <CardContent className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <action.icon className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">{action.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card className={`bg-black/40 backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-colors cursor-pointer ${action.color} h-24`}>
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <action.icon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">{action.label}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: KPIs and Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* KPI Overview */}
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
                    <div className="flex items-center justify-center mt-1">
                      <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                      <span className="text-xs text-green-400">+12%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">25%</p>
                    <p className="text-xs text-gray-400">Conversion Rate</p>
                    <div className="flex items-center justify-center mt-1">
                      <TrendingUp className="w-3 h-3 text-blue-400 mr-1" />
                      <span className="text-xs text-blue-400">+3%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">$25.8K</p>
                    <p className="text-xs text-gray-400">Monthly Revenue</p>
                    <div className="flex items-center justify-center mt-1">
                      <TrendingUp className="w-3 h-3 text-primary mr-1" />
                      <span className="text-xs text-primary">+18%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">1,450</p>
                    <p className="text-xs text-gray-400">Total Contacts</p>
                    <div className="flex items-center justify-center mt-1">
                      <TrendingUp className="w-3 h-3 text-purple-400 mr-1" />
                      <span className="text-xs text-purple-400">+8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Contacts */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Users className="w-5 h-5 mr-2" />
                  Recent Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contacts.length > 0 ? (
                    contacts.slice(0, 5).map((contact: any, index: number) => (
                      <div key={contact.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {contact.firstName?.[0]}{contact.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className="text-xs text-gray-400">{contact.company}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {contact.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Users className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No contacts yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Column: Tasks and Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Tasks Overview */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-primary">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Priority Tasks
                  </div>
                  <Badge variant="secondary">{tasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {upcomingTasks.length > 0 ? (
                    upcomingTasks.map((task: any) => (
                      <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                        <div className="mt-1">
                          {task.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{task.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-2">{task.description}</p>
                          <div className="flex items-center mt-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs mr-2 ${
                                task.priority === 'high' ? 'text-red-400 border-red-400' :
                                task.priority === 'medium' ? 'text-yellow-400 border-yellow-400' :
                                'text-green-400 border-green-400'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                            {task.dueDate && (
                              <span className="text-xs text-gray-500">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-sm text-gray-400">All caught up!</p>
                      <p className="text-xs text-gray-500">No pending tasks</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Zap className="w-5 h-5 mr-2" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Services</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-xs text-green-400">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Assistant</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">External APIs</span>
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
                      <span className="text-xs text-yellow-400">Partial</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Calendar and Communication */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Calendar Events */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event: any) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-lg">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{event.title}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(event.startTime).toLocaleDateString()} • 
                            {new Date(event.startTime).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          {event.location && (
                            <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-sm text-gray-400">No upcoming events</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Schedule Meeting
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Communication */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button size="sm" variant="outline" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    SMS
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Web
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Saint Vision Group LLC Brokerage */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <Shield className="w-5 h-5 mr-2" />
                  Saint Vision Brokerage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Active Listings</p>
                    <p className="text-lg font-bold text-purple-400">{brokerageData?.listings || 24}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Pending Sales</p>
                    <p className="text-lg font-bold text-green-400">{brokerageData?.pendingSales || 8}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Monthly Commission</span>
                    <span>${brokerageData?.monthlyCommission || '12.5K'}</span>
                  </div>
                  <Progress value={brokerageData?.commissionProgress || 78} className="h-2" />
                </div>
                <Button size="sm" className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30">
                  Open GHL Brokerage
                </Button>
              </CardContent>
            </Card>

            {/* SuperSal Execution Chat */}
            <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  SuperSal Execution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-32 bg-gray-900/50 rounded-lg p-3 overflow-y-auto text-xs space-y-2">
                  <div className="text-cyan-400">
                    <span className="text-gray-400">[10:47]</span> Task: Lead outreach campaign initiated
                  </div>
                  <div className="text-green-400">
                    <span className="text-gray-400">[10:45]</span> ✓ Email sequences deployed to 47 prospects
                  </div>
                  <div className="text-yellow-400">
                    <span className="text-gray-400">[10:43]</span> ⚡ GHL sync: 12 new contacts processed
                  </div>
                  <div className="text-purple-400">
                    <span className="text-gray-400">[10:41]</span> 🎯 Revenue goal: $2.8K of $4K achieved
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Ask SuperSal..." 
                    className="flex-1 bg-gray-900/50 border border-gray-600 rounded px-2 py-1 text-xs text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                  <Button size="sm" className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 px-3">
                    →
                  </Button>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Active: 5 tasks</span>
                  <span>Completed: 7/12</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tasks Completed</span>
                    <span>7/12</span>
                  </div>
                  <Progress value={58} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Calls Made</span>
                    <span>5/8</span>
                  </div>
                  <Progress value={63} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Revenue Goal</span>
                    <span>$2.8K/$4K</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </CardContent>
            </Card>
            {/* Drag & Drop Zone for Screenshots */}
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20 col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Upload className="w-5 h-5 mr-2" />
                  Quick File Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DragDropZone 
                  className="min-h-[80px]"
                  compact={true}
                  onFileUpload={(files) => {
                    console.log('Files uploaded:', files);
                    // Integration with AI assistant and analysis
                  }}
                />
              </CardContent>
            </Card>

            {/* Terminal Integration */}
            <div className="col-span-full">
              <TerminalIntegration embedded={true} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}