import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MoodType = 'happy' | 'calm' | 'excited' | 'anxious' | 'sad' | 'angry' | 'neutral';

export interface MoodEntry {
  id: string;
  date: string;
  mood: MoodType;
  intensity: number; // 1-10
  note: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  timestamp: number;
  mood?: MoodType;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  dailyReminders: boolean;
  reminderTime: string;
  userName: string;
  aiPersonality: 'zen' | 'friendly' | 'professional';
}

interface AppState {
  // Data
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  chatHistory: ChatMessage[];
  settings: AppSettings;
  
  // Actions
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Computed
  getRecentMoods: (days?: number) => MoodEntry[];
  getMoodTrend: () => 'improving' | 'declining' | 'stable';
  getTodaysMood: () => MoodEntry | null;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      moodEntries: [],
      journalEntries: [],
      chatHistory: [],
      settings: {
        theme: 'system',
        dailyReminders: true,
        reminderTime: '20:00',
        userName: '',
        aiPersonality: 'zen'
      },

      // Actions
      addMoodEntry: (entry) => set((state) => ({
        moodEntries: [...state.moodEntries, {
          ...entry,
          id: generateId(),
          timestamp: Date.now()
        }]
      })),

      addJournalEntry: (entry) => set((state) => ({
        journalEntries: [...state.journalEntries, {
          ...entry,
          id: generateId(),
          timestamp: Date.now()
        }]
      })),

      updateJournalEntry: (id, updates) => set((state) => ({
        journalEntries: state.journalEntries.map(entry =>
          entry.id === id ? { ...entry, ...updates } : entry
        )
      })),

      deleteJournalEntry: (id) => set((state) => ({
        journalEntries: state.journalEntries.filter(entry => entry.id !== id)
      })),

      addChatMessage: (message) => set((state) => ({
        chatHistory: [...state.chatHistory, {
          ...message,
          id: generateId(),
          timestamp: Date.now()
        }]
      })),

      clearChatHistory: () => set({ chatHistory: [] }),

      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),

      // Computed functions
      getRecentMoods: (days = 7) => {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        return get().moodEntries.filter(entry => entry.timestamp > cutoff);
      },

      getMoodTrend: () => {
        const recentMoods = get().getRecentMoods(7);
        if (recentMoods.length < 2) return 'stable';
        
        const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
        const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.intensity, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.intensity, 0) / secondHalf.length;
        
        const difference = secondAvg - firstAvg;
        
        if (difference > 0.5) return 'improving';
        if (difference < -0.5) return 'declining';
        return 'stable';
      },

      getTodaysMood: () => {
        const today = new Date().toDateString();
        const todayEntry = get().moodEntries.find(entry => 
          new Date(entry.timestamp).toDateString() === today
        );
        return todayEntry || null;
      }
    }),
    {
      name: 'wellness-app-storage'
    }
  )
);