import React, { useState, useEffect } from 'react';
import { Brain, Clock, Star, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Memory {
  id: string;
  content: string;
  memoryType: string;
  importance: number;
  metadata?: any;
  createdAt: Date;
  sessionId: string;
}

interface MemoryPanelProps {
  workspace: 'warroom' | 'saintsalme';
  className?: string;
}

export function MemoryPanel({ workspace, className = "" }: MemoryPanelProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadMemories();
  }, [workspace]);

  const loadMemories = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(`/api/memory/${workspace}`);
      setMemories(response.memories || []);
    } catch (error: any) {
      toast({
        title: "Failed to load memories",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await apiRequest('/api/memory/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace,
          content: newNote,
          importance: 3
        })
      });

      if (response.success) {
        setNewNote('');
        loadMemories();
        toast({
          title: "Memory Saved",
          description: "Your note has been saved to AI memory",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to save memory",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 4) return 'text-red-500 bg-red-100 dark:bg-red-900/20';
    if (importance >= 3) return 'text-amber-500 bg-amber-100 dark:bg-amber-900/20';
    return 'text-slate-500 bg-slate-100 dark:bg-slate-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file_upload':
      case 'execution_file':
        return '📄';
      case 'user_note':
        return '📝';
      case 'ai_insight':
        return '🧠';
      default:
        return '💭';
    }
  };

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || memory.memoryType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`flex flex-col h-full space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Brain className={`w-5 h-5 ${workspace === 'warroom' ? 'text-blue-500' : 'text-amber-500'}`} />
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          AI Memory ({filteredMemories.length})
        </h3>
      </div>

      {/* Add New Note */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note to AI memory..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[80px] text-sm"
        />
        <Button
          onClick={saveNote}
          disabled={!newNote.trim()}
          size="sm"
          className={`w-full ${workspace === 'warroom' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-600 hover:bg-amber-700'}`}
        >
          Save to Memory
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
        >
          <option value="all">All</option>
          <option value="user_note">Notes</option>
          <option value="file_upload">Files</option>
          <option value="execution_file">Execution</option>
          <option value="ai_insight">Insights</option>
        </select>
      </div>

      {/* Memory List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No memories found</p>
            <p className="text-xs">Upload files or add notes to build AI memory</p>
          </div>
        ) : (
          filteredMemories.map((memory) => (
            <div
              key={memory.id}
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{getTypeIcon(memory.memoryType)}</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getImportanceColor(memory.importance)}`}
                  >
                    {memory.importance >= 4 ? 'Critical' : memory.importance >= 3 ? 'Important' : 'Normal'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(memory.createdAt)}</span>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                {memory.content}
              </p>
              {memory.metadata && (
                <div className="text-xs text-slate-500">
                  {memory.metadata.originalName && (
                    <span>File: {memory.metadata.originalName}</span>
                  )}
                  {memory.metadata.analysis && (
                    <span className="ml-2 text-green-600">✓ AI Analyzed</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}