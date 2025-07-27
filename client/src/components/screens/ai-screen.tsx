import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Bot, 
  Mic, 
  Trash2, 
  Paperclip, 
  Send, 
  Upload,
  Download,
  Brain,
  File,
  Code,
  Search,
  Volume2,
  Eye,
  FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GlassmorphismCard from "@/components/ui/glassmorphism-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const aiTools = [
  { id: "playground", name: "Assistant Playground", icon: Bot, active: true },
  { id: "files", name: "Files & Embedding", icon: File, active: false },
  { id: "code", name: "Code Interpreter", icon: Code, active: false },
  { id: "search", name: "Azure Cognitive Search", icon: Search, active: false },
  { id: "stt", name: "Speech-to-Text", icon: Mic, active: false },
  { id: "tts", name: "Text-to-Speech", icon: Volume2, active: false },
  { id: "vision", name: "Vision OCR", icon: Eye, active: false },
  { id: "api", name: "API Tester", icon: FlaskConical, active: false },
];

export default function AIScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello Ryan! I'm SuperSal™, your AI command center assistant. I'm connected to all your systems including GHL, Stripe, Supabase, and Azure services. How can I help you manage your operations today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeTool, setActiveTool] = useState("playground");
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: aiMemory } = useQuery({
    queryKey: ["/api/ai-memory"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat/completions", {
        messages: [
          { role: "system", content: "You are SuperSal™, an AI assistant for the PartnerTech.ai command center. You have access to GHL, Stripe, Azure, and other business systems. Be helpful, professional, and concise." },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: message }
        ],
        model: "gpt-4o"
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error: any) => {
      toast({
        title: "Chat Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const fileUploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('File upload failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "File Uploaded",
        description: `Successfully processed ${data.filename}`,
      });
      // Add file content to chat
      const fileMessage: ChatMessage = {
        role: "assistant",
        content: `File "${data.filename}" has been processed and analyzed:\n\n${data.content}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fileMessage]);
    },
    onError: (error: any) => {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      fileUploadMutation.mutate(file);
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // In a real implementation, this would use the Web Speech API or Azure Speech SDK
    toast({
      title: "Voice Input",
      description: isListening ? "Voice input stopped" : "Voice input started",
    });
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared. How can I help you?",
      timestamp: new Date(),
    }]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full"
    >
      {/* AI Tools Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassmorphismCard className="p-4">
          <CardTitle className="mb-4 flex items-center">
            <Bot className="w-5 h-5 text-primary mr-2" />
            AI Tools
          </CardTitle>
          <div className="space-y-2">
            {aiTools.map((tool) => (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="w-4 h-4 mr-2" />
                {tool.name}
              </Button>
            ))}
          </div>
        </GlassmorphismCard>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2"
      >
        <GlassmorphismCard className="ai-chat-container">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center">
              <Bot className="w-5 h-5 text-primary mr-2" />
              GPT-4o Chat Interface
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleVoiceToggle}
                className={isListening ? "text-primary" : ""}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={clearChat}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-3 ${
                  message.role === "user" ? "justify-end" : ""
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div className={`max-w-md ${message.role === "user" ? "order-first" : ""}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary/20 ml-auto"
                        : "bg-white/10"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${
                    message.role === "user" ? "text-right" : ""
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {message.role === "user" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                    <AvatarFallback>RC</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
            
            {chatMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp3,.wav"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={fileUploadMutation.isPending}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border-0 focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={chatMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || chatMutation.isPending}
              className="bg-primary hover:bg-primary/80"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </GlassmorphismCard>
      </motion.div>

      {/* Memory & Files Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassmorphismCard className="p-4">
          <CardTitle className="mb-4 flex items-center">
            <Brain className="w-5 h-5 text-primary mr-2" />
            Memory & Files
          </CardTitle>

          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 hover:border-primary transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Drop files here or click to upload</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, ZIP supported</p>
            </div>
          </div>

          {/* Recent Files */}
          <div className="space-y-2 mb-6">
            <h4 className="text-sm font-medium text-gray-400">Recent Files</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-white/5 transition-colors">
                <File className="w-4 h-4 text-red-400" />
                <span className="text-xs flex-1">ghl-integration-guide.pdf</span>
                <Download className="w-3 h-3 text-gray-400 cursor-pointer" />
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-white/5 transition-colors">
                <File className="w-4 h-4 text-blue-400" />
                <span className="text-xs flex-1">hacp-protocol.docx</span>
                <Download className="w-3 h-3 text-gray-400 cursor-pointer" />
              </div>
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-white/5 transition-colors">
                <File className="w-4 h-4 text-yellow-400" />
                <span className="text-xs flex-1">supersal-config.zip</span>
                <Download className="w-3 h-3 text-gray-400 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Memory Log */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">AI Memory</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-white/5 rounded">
                <div className="text-green-400">✓ Learned: GHL webhook configuration</div>
                <div className="text-gray-500">2 hours ago</div>
              </div>
              <div className="p-2 bg-white/5 rounded">
                <div className="text-blue-400">📊 Updated: Client pipeline data</div>
                <div className="text-gray-500">4 hours ago</div>
              </div>
              <div className="p-2 bg-white/5 rounded">
                <div className="text-primary">🧠 Processed: HACP protocol docs</div>
                <div className="text-gray-500">Yesterday</div>
              </div>
            </div>
          </div>
        </GlassmorphismCard>
      </motion.div>
    </motion.div>
  );
}
