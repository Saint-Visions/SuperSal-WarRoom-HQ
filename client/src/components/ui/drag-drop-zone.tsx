import { useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image, FileText, Code, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DragDropZoneProps {
  children?: ReactNode;
  onFileUpload?: (files: FileList) => void;
  className?: string;
  compact?: boolean;
  acceptTypes?: string[];
}

export default function DragDropZone({ 
  children, 
  onFileUpload, 
  className = "",
  compact = false,
  acceptTypes = ["image/*", "text/*", ".pdf", ".doc", ".docx"]
}: DragDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${data.files?.length || 1} file(s)`
      });
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed", 
        description: error.message,
        variant: "destructive"
      });
      setIsUploading(false);
    }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    if (onFileUpload) {
      onFileUpload(files);
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });
    
    uploadMutation.mutate(formData);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('text') || file.name.endsWith('.md')) return FileText;
    if (file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.tsx')) return Code;
    return FileText;
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptTypes.join(",")}
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative cursor-pointer transition-all duration-300
          ${isDragOver ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''}
          ${compact ? 'min-h-[60px]' : 'min-h-[120px]'}
          ${className.includes('bg-') ? '' : 'bg-black/20 backdrop-blur-sm'}
          rounded-lg border-2 border-dashed border-gray-600 hover:border-primary/50
        `}
      >
        {children || (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <Upload className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400 mb-2`} />
            <p className={`text-gray-400 text-center ${compact ? 'text-sm' : ''}`}>
              {compact ? 'Drop files or click' : 'Drop screenshots, files, or click to upload'}
            </p>
            {!compact && (
              <p className="text-xs text-gray-500 mt-1">
                Images, documents, code files supported
              </p>
            )}
          </div>
        )}

        {/* Upload overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-lg flex items-center justify-center"
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-primary font-medium">Drop files here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading overlay */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-white">Uploading...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Floating Drop Zone for Sticky Companion
export function FloatingDropZone({ onFileUpload }: { onFileUpload?: (files: FileList) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-20 right-4 z-50"
        >
          <DragDropZone
            onFileUpload={onFileUpload}
            compact={true}
            className="w-48 bg-black/80 backdrop-blur-xl border border-primary/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}