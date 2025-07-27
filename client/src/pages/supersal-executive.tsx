import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Star, 
  Search, 
  Plus, 
  Bot,
  Filter,
  Calendar,
  MessageSquare,
  Trash2,
  Edit,
  Zap
} from "lucide-react";

interface SupersalTask {
  id: string;
  title: string;
  description: string;
  instructions: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  dueDate: string | null;
  completed: boolean;
  aiGenerated: boolean;
  supersalResponse: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function SupersalExecutive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskInstructions, setNewTaskInstructions] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/supersal/tasks'],
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      return apiRequest('/api/supersal/tasks', {
        method: 'POST',
        body: taskData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/supersal/tasks'] });
      setShowNewTaskForm(false);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskInstructions("");
      setNewTaskPriority("medium");
      toast({
        title: "Task Created",
        description: "SuperSal™ has received your new task"
      });
    },
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return apiRequest(`/api/supersal/tasks/${taskId}/complete`, {
        method: 'PATCH'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/supersal/tasks'] });
      toast({
        title: "Task Completed",
        description: "SuperSal™ has marked the task as complete"
      });
    },
  });

  // AI Task Generation
  const generateAITaskMutation = useMutation({
    mutationFn: async (prompt: string) => {
      return apiRequest('/api/supersal/generate-task', {
        method: 'POST',
        body: { prompt }
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/supersal/tasks'] });
      toast({
        title: "AI Task Generated",
        description: "SuperSal™ has created an intelligent task based on your request"
      });
    },
  });

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    createTaskMutation.mutate({
      title: newTaskTitle,
      description: newTaskDescription,
      instructions: newTaskInstructions,
      priority: newTaskPriority,
      aiGenerated: false
    });
  };

  const handleGenerateAITask = () => {
    const prompt = `Create a strategic business task based on current operations and priorities. Consider CRM optimization, revenue growth, and system efficiency.`;
    generateAITaskMutation.mutate(prompt);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-400 bg-red-400/10";
      case "high": return "text-orange-400 bg-orange-400/10";
      case "medium": return "text-yellow-400 bg-yellow-400/10";
      case "low": return "text-green-400 bg-green-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "in_progress": return <Clock className="w-4 h-4 text-blue-400" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task: SupersalTask) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-charcoal text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">SuperSal™ Executive</h1>
              <p className="text-gray-400">Strategic Task Management & AI Execution</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleGenerateAITask}
                disabled={generateAITaskMutation.isPending}
                className="bg-primary hover:bg-primary/80 text-black"
              >
                <Bot className="w-4 h-4 mr-2" />
                {generateAITaskMutation.isPending ? "Generating..." : "AI Task"}
              </Button>
              <Button
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                className="bg-gray-700 hover:bg-gray-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks, descriptions, or instructions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-gray-600 focus:border-primary"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 bg-white/5 border-gray-600">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-40 bg-white/5 border-gray-600">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Task Form */}
        {showNewTaskForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Task
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="bg-white/5 border-gray-600 focus:border-primary"
                />
                <Textarea
                  placeholder="Task description..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="bg-white/5 border-gray-600 focus:border-primary"
                  rows={3}
                />
                <Textarea
                  placeholder="Detailed instructions for SuperSal™..."
                  value={newTaskInstructions}
                  onChange={(e) => setNewTaskInstructions(e.target.value)}
                  className="bg-white/5 border-gray-600 focus:border-primary"
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                    <SelectTrigger className="w-32 bg-white/5 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewTaskForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTask}
                      disabled={createTaskMutation.isPending || !newTaskTitle.trim()}
                      className="bg-primary hover:bg-primary/80 text-black"
                    >
                      {createTaskMutation.isPending ? "Creating..." : "Create Task"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tasks Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTasks.map((task: SupersalTask, index: number) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-primary/20 h-full hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    {task.aiGenerated && (
                      <Badge variant="outline" className="text-primary border-primary">
                        <Bot className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task.description && (
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {task.description}
                    </p>
                  )}
                  
                  {task.instructions && (
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-300 line-clamp-4">
                        <span className="font-medium text-primary">Instructions: </span>
                        {task.instructions}
                      </p>
                    </div>
                  )}

                  {task.supersalResponse && (
                    <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                      <p className="text-xs text-primary line-clamp-3">
                        <span className="font-medium">SuperSal™: </span>
                        {task.supersalResponse}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      {!task.completed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
                          onClick={() => completeTaskMutation.mutate(task.id)}
                          disabled={completeTaskMutation.isPending}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredTasks.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first task or let SuperSal™ generate one for you
            </p>
            <Button
              onClick={handleGenerateAITask}
              className="bg-primary hover:bg-primary/80 text-black"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate AI Task
            </Button>
          </motion.div>
        )}

        {/* SuperSal Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Card className="bg-primary/90 backdrop-blur-xl border-primary w-80">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-black font-medium text-sm">SuperSal™ Executive</p>
                  <p className="text-black/70 text-xs">
                    {filteredTasks.filter((t: SupersalTask) => !t.completed).length} active tasks • 
                    Ready for instructions
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