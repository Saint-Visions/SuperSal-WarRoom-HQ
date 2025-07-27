import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Users, 
  StickyNote, 
  BarChart3, 
  TrendingUp, 
  Server, 
  Wifi,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnimatedCounter from "@/components/ui/animated-counter";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";
import { useRealTimeData } from "@/hooks/use-real-time-data";

export default function CommandScreen() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { isOnline, lastSync } = useRealTimeData();

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner" />
      </div>
    );
  }

  const { contacts = [], tasks = [], kpiMetrics = [], calendarEvents = [], externalKPIs = {} } = dashboardData || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Status Bar */}
      <GlassmorphismCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={isOnline ? "status-online" : "status-offline"} />
              <span className="text-sm font-medium">
                {isOnline ? "All Systems Online" : "System Offline"}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              Last sync: {lastSync ? formatTimeAgo(lastSync) : "Never"}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <Server className="w-4 h-4 text-primary" />
              <span>Server: 99.9%</span>
            </span>
            <span className="flex items-center space-x-1">
              <Wifi className="w-4 h-4 text-primary" />
              <span>API: Connected</span>
            </span>
          </div>
        </div>
      </GlassmorphismCard>

      {/* Dashboard Grid */}
      <div className="command-grid">
        {/* Calendar Widget */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassmorphismCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 text-primary mr-2" />
                Calendar & Schedule
              </CardTitle>
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary" className="text-xs">Day</Button>
                <Button size="sm" variant="ghost" className="text-xs">Week</Button>
                <Button size="sm" variant="ghost" className="text-xs">Month</Button>
              </div>
            </div>
            <div className="space-y-3">
              {calendarEvents.length > 0 ? (
                calendarEvents.map((event: any, index: number) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="w-2 h-8 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(event.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {new Date(event.endTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    {event.meetingType === 'video' && <Wifi className="w-4 h-4 text-gray-400" />}
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No events scheduled for today</p>
                </div>
              )}
            </div>
          </GlassmorphismCard>
        </motion.div>

        {/* KPIs Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassmorphismCard className="p-6">
            <CardTitle className="mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-primary mr-2" />
              Key Metrics
            </CardTitle>
            <div className="space-y-4">
              <div className="metric-card">
                <div className="text-sm text-gray-400">Monthly Revenue</div>
                <div className="metric-value text-green-400">
                  $<AnimatedCounter value={externalKPIs.monthlyRevenue || 127890} />
                </div>
                <div className="metric-change-positive">↗ +12.4%</div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-gray-400">Active Leads</div>
                <div className="metric-value text-blue-400">
                  <AnimatedCounter value={externalKPIs.activeLeads || 342} />
                </div>
                <div className="metric-change-positive">↗ +8.2%</div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-gray-400">Conversion Rate</div>
                <div className="metric-value text-primary">
                  <AnimatedCounter value={externalKPIs.conversionRate || 24.6} suffix="%" />
                </div>
                <div className="metric-change-positive">↗ +3.1%</div>
              </div>
              <div className="metric-card">
                <div className="text-sm text-gray-400">System Uptime</div>
                <div className="metric-value text-green-400">99.9%</div>
                <div className="metric-change-positive">Excellent</div>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts & Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassmorphismCard className="p-6">
            <CardTitle className="mb-4 flex items-center">
              <Users className="w-5 h-5 text-primary mr-2" />
              Recent Contacts
            </CardTitle>
            <div className="space-y-3">
              {contacts.length > 0 ? (
                contacts.slice(0, 3).map((contact: any, index: number) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {contact.firstName?.charAt(0)}{contact.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {contact.status} • Last contact: {formatTimeAgo(new Date(contact.lastContactDate || contact.createdAt))}
                      </div>
                    </div>
                    <div className="status-online" />
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent contacts</p>
                </div>
              )}
            </div>
          </GlassmorphismCard>
        </motion.div>

        {/* Memory Console */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassmorphismCard className="p-6">
            <CardTitle className="mb-4 flex items-center">
              <StickyNote className="w-5 h-5 text-primary mr-2" />
              Memory Console
            </CardTitle>
            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.slice(0, 3).map((task: any, index: number) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Priority: {task.priority} • Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No pending tasks</p>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-dashed hover:border-primary hover:bg-primary/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Note
            </Button>
          </GlassmorphismCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
