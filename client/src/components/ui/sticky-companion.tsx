import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Upload, 
  Terminal,
  MessageSquare,
  Image,
  FileText,
  Code,
  X,
  Mic,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DragDropZone from "@/components/ui/drag-drop-zone";
import TerminalIntegration from "@/components/ui/terminal-integration";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface StickyCompanionProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  minimized?: boolean;
}

export default function StickyCompanion({ 
  position = "bottom-right",
  minimized = true 
}: StickyCompanionProps) {
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [currentMode, setCurrentMode] = useState<"chat" | "upload" | "terminal">("chat");
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (query: string) => {
      return await apiRequest("POST", "/api/chat/completions", {
        messages: [
          { role: "system", content: "You are SuperSal™, the AI companion for the PartnerTech.ai War Room. Help with tasks, file analysis, and operations management." },
          { role: "user", content: query }
        ],
        model: "gpt-4o"
      });
    },
    onSuccess: (data) => {
      toast({
        title: "SuperSal™ Response",
        description: data.choices?.[0]?.message?.content || "Task completed"
      });
    }
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    chatMutation.mutate(message);
    setMessage("");
  };

  const handleFileUpload = (uploadedFiles: FileList) => {
    setFiles(uploadedFiles);
    toast({
      title: "Files Ready",
      description: `${uploadedFiles.length} file(s) ready for analysis`
    });
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Voice Input Active",
        description: "Speak now - SuperSal™ is listening"
      });
    }
  };

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4", 
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4"
  };

  const modes = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "upload", label: "Upload", icon: Upload },
    { id: "terminal", label: "Terminal", icon: Terminal }
  ];

  if (isMinimized) {
    return (
      <motion.div
        className={`fixed z-50 ${positionClasses[position]}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-black shadow-2xl"
        >
          <Bot className="w-8 h-8" />
        </Button>
        
        {/* Pulsing indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`fixed z-50 ${positionClasses[position]}`}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      style={{ width: "380px", maxHeight: "600px" }}
    >
      <Card className="bg-black/90 backdrop-blur-xl border border-primary/30 shadow-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-primary text-lg">
              <Bot className="w-5 h-5 mr-2" />
              SuperSal™ Companion
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs text-green-400">
                Online
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Mode Selector */}
          <div className="flex space-x-1 mt-2">
            {modes.map((mode) => (
              <Button
                key={mode.id}
                size="sm"
                variant={currentMode === mode.id ? "default" : "ghost"}
                onClick={() => setCurrentMode(mode.id as any)}
                className="flex-1 text-xs"
              >
                <mode.icon className="w-3 h-3 mr-1" />
                {mode.label}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <AnimatePresence mode="wait">
            {currentMode === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-3"
              >
                <Textarea
                  placeholder="Ask SuperSal™ anything about your operations..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px] bg-white/5 border-gray-600 focus:border-primary resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSendMessage();
                    }
                  }}
                />
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleVoiceToggle}
                    variant="outline"
                    size="sm"
                    className={isListening ? "bg-red-500/20 text-red-400" : ""}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || chatMutation.isPending}
                    className="flex-1 bg-primary hover:bg-primary/80 text-black"
                  >
                    {chatMutation.isPending ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-xs text-gray-400 text-center">
                  Ctrl+Enter to send • Voice input available
                </div>
              </motion.div>
            )}

            {currentMode === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-3"
              >
                <DragDropZone
                  onFileUpload={handleFileUpload}
                  className="min-h-[120px]"
                  acceptTypes={["image/*", "text/*", ".pdf", ".doc", ".docx", ".csv", ".json"]}
                />
                
                {files && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Ready to analyze:</p>
                    {Array.from(files).map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-800/50 rounded">
                        {file.type.startsWith('image/') ? (
                          <Image className="w-4 h-4 text-blue-400" />
                        ) : file.name.includes('.') && ['js', 'ts', 'tsx', 'py'].includes(file.name.split('.').pop() || '') ? (
                          <Code className="w-4 h-4 text-green-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-xs flex-1">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)}KB
                        </span>
                      </div>
                    ))}
                    
                    <Button
                      onClick={() => {
                        const fileNames = Array.from(files).map(f => f.name).join(', ');
                        setMessage(`Analyze these files: ${fileNames}`);
                        setCurrentMode("chat");
                      }}
                      className="w-full bg-primary hover:bg-primary/80 text-black"
                      size="sm"
                    >
                      Analyze with SuperSal™
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {currentMode === "terminal" && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-3"
              >
                <TerminalIntegration embedded={true} />
                
                <div className="text-xs text-gray-400 text-center">
                  Execute commands • VS Code integration
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}