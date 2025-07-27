import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  StickyNote, 
  Plus, 
  X, 
  Edit, 
  Save,
  Calendar,
  User,
  AlertCircle,
  Pin
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface StickyNote {
  id: string;
  content: string;
  color: string;
  type: 'note' | 'contact' | 'reminder' | 'task';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export default function StickyNotes() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<'note' | 'contact' | 'reminder' | 'task'>('note');
  const [notePriority, setNotePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const queryClient = useQueryClient();

  // Fetch sticky notes
  const { data: stickyNotes = [] } = useQuery({
    queryKey: ['/api/sticky-notes'],
    refetchInterval: 10000,
  });

  // Create sticky note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: { content: string; type: string; priority: string }) => {
      return apiRequest('/api/sticky-notes', {
        method: 'POST',
        body: {
          ...noteData,
          color: getColorByType(noteData.type),
          pinned: false
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sticky-notes'] });
      setIsCreating(false);
      setNewNote("");
    },
  });

  // Update sticky note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string; content?: string; pinned?: boolean }) => {
      return apiRequest(`/api/sticky-notes/${id}`, {
        method: 'PUT',
        body: updateData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sticky-notes'] });
      setEditingId(null);
    },
  });

  // Delete sticky note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/sticky-notes/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sticky-notes'] });
    },
  });

  const getColorByType = (type: string) => {
    switch (type) {
      case 'contact': return 'bg-blue-500/20 border-blue-400';
      case 'reminder': return 'bg-yellow-500/20 border-yellow-400';
      case 'task': return 'bg-green-500/20 border-green-400';
      default: return 'bg-purple-500/20 border-purple-400';
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'contact': return User;
      case 'reminder': return Calendar;
      case 'task': return AlertCircle;
      default: return StickyNote;
    }
  };

  const handleCreateNote = () => {
    if (newNote.trim()) {
      createNoteMutation.mutate({
        content: newNote,
        type: noteType,
        priority: notePriority
      });
    }
  };

  const handleUpdateNote = (id: string, content: string) => {
    updateNoteMutation.mutate({ id, content });
  };

  const handleTogglePin = (id: string, currentPinned: boolean) => {
    updateNoteMutation.mutate({ id, pinned: !currentPinned });
  };

  const pinnedNotes = stickyNotes.filter((note: StickyNote) => note.pinned);
  const unpinnedNotes = stickyNotes.filter((note: StickyNote) => !note.pinned);

  return (
    <div className="space-y-4">
      {/* Create New Note */}
      <Card className="bg-black/40 backdrop-blur-xl border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-primary">
            <div className="flex items-center">
              <StickyNote className="w-5 h-5 mr-2" />
              Sticky Notes
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreating(!isCreating)}
              className="bg-primary/20 hover:bg-primary/30"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as any)}
                    className="bg-gray-900/50 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  >
                    <option value="note">Note</option>
                    <option value="contact">Contact</option>
                    <option value="reminder">Reminder</option>
                    <option value="task">Task</option>
                  </select>
                  <select
                    value={notePriority}
                    onChange={(e) => setNotePriority(e.target.value as any)}
                    className="bg-gray-900/50 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note..."
                  className="bg-gray-900/50 border-gray-600 text-white"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleCreateNote}
                    disabled={createNoteMutation.isPending}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400 flex items-center">
            <Pin className="w-4 h-4 mr-1" />
            Pinned Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pinnedNotes.map((note: StickyNote) => (
              <StickyNoteCard
                key={note.id}
                note={note}
                editingId={editingId}
                setEditingId={setEditingId}
                onUpdate={handleUpdateNote}
                onDelete={deleteNoteMutation.mutate}
                onTogglePin={handleTogglePin}
                getColorByType={getColorByType}
                getIconByType={getIconByType}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {unpinnedNotes.map((note: StickyNote) => (
          <StickyNoteCard
            key={note.id}
            note={note}
            editingId={editingId}
            setEditingId={setEditingId}
            onUpdate={handleUpdateNote}
            onDelete={deleteNoteMutation.mutate}
            onTogglePin={handleTogglePin}
            getColorByType={getColorByType}
            getIconByType={getIconByType}
          />
        ))}
      </div>
    </div>
  );
}

function StickyNoteCard({ 
  note, 
  editingId, 
  setEditingId, 
  onUpdate, 
  onDelete, 
  onTogglePin,
  getColorByType,
  getIconByType 
}: any) {
  const [editContent, setEditContent] = useState(note.content);
  const IconComponent = getIconByType(note.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className={`${getColorByType(note.type)} backdrop-blur-xl relative`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconComponent className="w-4 h-4" />
              <Badge variant="outline" className="text-xs">
                {note.type}
              </Badge>
              {note.priority === 'high' && (
                <Badge variant="destructive" className="text-xs">
                  High
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onTogglePin(note.id, note.pinned)}
                className="h-6 w-6 p-0"
              >
                <Pin className={`w-3 h-3 ${note.pinned ? 'text-yellow-400' : 'text-gray-400'}`} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingId(editingId === note.id ? null : note.id)}
                className="h-6 w-6 p-0"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(note.id)}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {editingId === note.id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bg-black/30 border-gray-600 text-white text-sm"
                rows={3}
              />
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  onClick={() => onUpdate(note.id, editContent)}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 h-6 text-xs"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                  className="h-6 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/90 whitespace-pre-wrap">{note.content}</p>
          )}
          <div className="mt-2 text-xs text-gray-400">
            {new Date(note.updatedAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}