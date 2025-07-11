import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Heart, Edit3, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { getMoodColor, getMoodEmoji } from '@/utils/moodHelpers';
import { MoodType } from '@/store/useAppStore';
import { toast } from 'sonner';

export default function Journal() {
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: '' as MoodType | '' });
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', content: '', mood: '' as MoodType | '' });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useSupabaseData();

  const handleCreateEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    try {
      await addJournalEntry({
        title: newEntry.title,
        content: newEntry.content,
        date: new Date().toDateString(),
        mood: newEntry.mood || undefined
      });
      
      setNewEntry({ title: '', content: '', mood: '' });
      setIsCreateDialogOpen(false);
      toast.success('Journal entry created!');
    } catch (error) {
      toast.error('Failed to create entry');
    }
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry.id);
    setEditData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    try {
      await updateJournalEntry(editingEntry, {
        title: editData.title,
        content: editData.content,
        mood: editData.mood || undefined
      });
      
      setEditingEntry(null);
      toast.success('Entry updated!');
    } catch (error) {
      toast.error('Failed to update entry');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteJournalEntry(id);
      toast.success('Entry deleted');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const moods: MoodType[] = ['happy', 'calm', 'excited', 'anxious', 'sad', 'angry', 'neutral'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Journal</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Reflect on your thoughts and feelings
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Mood (optional)</label>
                <Select
                  value={newEntry.mood}
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: value as MoodType }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map((mood) => (
                      <SelectItem key={mood} value={mood}>
                        <span className="flex items-center gap-2">
                          {getMoodEmoji(mood)} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  placeholder="What's on your mind?"
                  className="min-h-[200px]"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEntry}>
                  Create Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {journalEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {editingEntry === entry.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editData.title}
                            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                            className="text-lg font-semibold"
                          />
                          <Select
                            value={editData.mood}
                            onValueChange={(value) => setEditData(prev => ({ ...prev, mood: value as MoodType }))}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select mood" />
                            </SelectTrigger>
                            <SelectContent>
                              {moods.map((mood) => (
                                <SelectItem key={mood} value={mood}>
                                  <span className="flex items-center gap-2">
                                    {getMoodEmoji(mood)} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <>
                          <CardTitle className="text-xl mb-2">{entry.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                            </div>
                            {entry.mood && (
                              <Badge 
                                variant="secondary" 
                                className={`${getMoodColor(entry.mood)} text-white border-0`}
                              >
                                <Heart className="w-3 h-3 mr-1" />
                                {getMoodEmoji(entry.mood)} {entry.mood}
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {editingEntry === entry.id ? (
                        <>
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingEntry(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleEditEntry(entry)}>
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {editingEntry === entry.id ? (
                    <Textarea
                      value={editData.content}
                      onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[150px]"
                    />
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {journalEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Edit3 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No journal entries yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start writing down your thoughts and reflections
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first entry
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}