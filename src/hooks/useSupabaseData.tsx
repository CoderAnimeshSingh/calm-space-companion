import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { MoodType, MoodEntry, JournalEntry, ChatMessage } from '@/store/useAppStore';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load mood entries
      const { data: moods } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (moods) {
        const formattedMoods = moods.map(mood => ({
          id: mood.id,
          date: mood.date,
          mood: mood.mood as MoodType,
          intensity: mood.intensity,
          note: mood.note || '',
          timestamp: new Date(mood.created_at).getTime()
        }));
        setMoodEntries(formattedMoods);
      }

      // Load journal entries
      const { data: journals } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (journals) {
        const formattedJournals = journals.map(journal => ({
          id: journal.id,
          date: journal.created_at.split('T')[0],
          title: journal.title,
          content: journal.content,
          timestamp: new Date(journal.created_at).getTime(),
          mood: journal.mood as MoodType | undefined
        }));
        setJournalEntries(formattedJournals);
      }

      // Load chat messages
      const { data: chats } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (chats) {
        const formattedChats = chats.map(chat => ({
          id: chat.id,
          type: chat.type as 'user' | 'ai',
          content: chat.content,
          timestamp: new Date(chat.created_at).getTime()
        }));
        setChatMessages(formattedChats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const addMoodEntry = async (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mood_entries')
      .upsert({
        user_id: user.id,
        date: entry.date,
        mood: entry.mood,
        intensity: entry.intensity,
        note: entry.note
      })
      .select()
      .single();

    if (!error && data) {
      const formattedEntry = {
        id: data.id,
        date: data.date,
        mood: data.mood as MoodType,
        intensity: data.intensity,
        note: data.note || '',
        timestamp: new Date(data.created_at).getTime()
      };
      
      setMoodEntries(prev => {
        const filtered = prev.filter(m => m.date !== entry.date);
        return [formattedEntry, ...filtered].sort((a, b) => b.timestamp - a.timestamp);
      });
    }
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood
      })
      .select()
      .single();

    if (!error && data) {
      const formattedEntry = {
        id: data.id,
        date: data.created_at.split('T')[0],
        title: data.title,
        content: data.content,
        timestamp: new Date(data.created_at).getTime(),
        mood: data.mood as MoodType | undefined
      };
      
      setJournalEntries(prev => [formattedEntry, ...prev]);
    }
  };

  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
    if (!user) return;

    const { error } = await supabase
      .from('journal_entries')
      .update({
        title: updates.title,
        content: updates.content,
        mood: updates.mood
      })
      .eq('id', id);

    if (!error) {
      setJournalEntries(prev => 
        prev.map(entry => 
          entry.id === id ? { ...entry, ...updates } : entry
        )
      );
    }
  };

  const deleteJournalEntry = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);

    if (!error) {
      setJournalEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const sendChatMessage = async (message: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message, userId: user.id }
      });

      if (error) throw error;

      // Refresh chat messages
      await loadData();
      
      return data.response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      return null;
    }
  };

  const clearChatHistory = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', user.id);

    if (!error) {
      setChatMessages([]);
    }
  };

  return {
    moodEntries,
    journalEntries,
    chatMessages,
    loading,
    addMoodEntry,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    sendChatMessage,
    clearChatHistory
  };
};