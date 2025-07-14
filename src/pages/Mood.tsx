import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Calendar, TrendingUp, BarChart3, Heart, Clock, Save } from 'lucide-react';
import { moodConfig, formatMoodIntensity } from '@/utils/moodHelpers';
import { format } from 'date-fns';

type MoodType = 'happy' | 'calm' | 'excited' | 'anxious' | 'sad' | 'angry' | 'neutral';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string | null;
  date: string;
  created_at: string;
}

export default function Mood() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      toast({
        title: "Error",
        description: "Failed to load mood entries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveMoodEntry = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood: selectedMood,
          intensity,
          note: note.trim() || null,
          date: format(new Date(), 'yyyy-MM-dd')
        });

      if (error) throw error;

      toast({
        title: "Mood Saved",
        description: "Your mood has been recorded successfully.",
      });

      setNote('');
      fetchMoodEntries();
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Mood Tracker
        </h1>
        <p className="text-muted-foreground">
          Track your emotions and see patterns over time
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Mood Selection */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>How are you feeling right now?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mood Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(moodConfig).map(([mood, config]) => (
                    <motion.button
                      key={mood}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMood(mood as MoodType)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedMood === mood
                          ? 'border-primary bg-primary/10 shadow-mood'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{config.emoji}</div>
                      <div className="text-sm font-medium">{config.label}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Intensity Slider */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Intensity: {formatMoodIntensity(intensity)} ({intensity}/10)
                  </label>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-muted-foreground">Low</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intensity}
                      onChange={(e) => setIntensity(Number(e.target.value))}
                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-xs text-muted-foreground">High</span>
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Add a note (optional)
                  </label>
                  <Textarea
                    placeholder="What's on your mind? Describe what contributed to this mood..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={saveMoodEntry}
                  disabled={isSaving}
                  className="w-full bg-gradient-wellness hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Mood Entry'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Entries */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Recent Entries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : moodEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No mood entries yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start tracking your emotions!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {moodEntries.map((entry) => {
                      const config = moodConfig[entry.mood as MoodType];
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{config.emoji}</span>
                              <span className="font-medium">{config.label}</span>
                            </div>
                            <Badge variant="outline">
                              {formatMoodIntensity(entry.intensity)}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {format(new Date(entry.created_at), 'MMM d, h:mm a')}
                          </div>
                          {entry.note && (
                            <p className="text-sm text-muted-foreground">
                              {entry.note}
                            </p>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>This Week</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Entries</span>
                    <span className="font-medium">{moodEntries.length}</span>
                  </div>
                  {moodEntries.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg Intensity</span>
                        <span className="font-medium">
                          {(moodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / moodEntries.length).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Most Common</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">
                            {moodConfig[moodEntries[0]?.mood as MoodType]?.emoji}
                          </span>
                          <span className="font-medium text-sm">
                            {moodConfig[moodEntries[0]?.mood as MoodType]?.label}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}