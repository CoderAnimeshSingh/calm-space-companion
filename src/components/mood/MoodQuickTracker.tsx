import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, MoodType } from '@/store/useAppStore';
import { moodConfig } from '@/utils/moodHelpers';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const MoodQuickTracker = () => {
  const { addMoodEntry, getTodaysMood } = useAppStore();
  const todaysMood = getTodaysMood();
  
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(todaysMood?.mood || null);
  const [intensity, setIntensity] = useState([todaysMood?.intensity || 5]);
  const [note, setNote] = useState(todaysMood?.note || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    try {
      addMoodEntry({
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood,
        intensity: intensity[0],
        note: note.trim()
      });

      toast({
        title: "Mood logged successfully!",
        description: `Thank you for checking in. Your ${moodConfig[selectedMood].label.toLowerCase()} mood has been recorded.`,
      });

      // Reset form if this wasn't an update
      if (!todaysMood) {
        setSelectedMood(null);
        setIntensity([5]);
        setNote('');
      }
    } catch (error) {
      toast({
        title: "Error logging mood",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <div>
        <h3 className="text-sm font-medium mb-3">Select your mood:</h3>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(moodConfig).map(([mood, config]) => (
            <motion.div
              key={mood}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-mood ${
                  selectedMood === mood
                    ? `ring-2 ring-${config.color} bg-${config.color}/10`
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedMood(mood as MoodType)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{config.emoji}</div>
                  <div className="text-xs font-medium">{config.label}</div>
                </div>
                {selectedMood === mood && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1"
                  >
                    <Check className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Intensity Slider */}
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Intensity Level:</label>
            <span className="text-sm text-muted-foreground">{intensity[0]}/10</span>
          </div>
          <Slider
            value={intensity}
            onValueChange={setIntensity}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mild</span>
            <span>Intense</span>
          </div>
        </motion.div>
      )}

      {/* Note */}
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <label className="text-sm font-medium">
            What's on your mind? (optional)
          </label>
          <Textarea
            placeholder="Share any thoughts or experiences that contributed to this mood..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[80px]"
          />
        </motion.div>
      )}

      {/* Submit Button */}
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-wellness hover:opacity-90"
          >
            {isSubmitting ? 'Saving...' : todaysMood ? 'Update Mood' : 'Log Mood'}
          </Button>
        </motion.div>
      )}

      {/* Today's Mood Display */}
      {todaysMood && !selectedMood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-muted/30 rounded-lg border border-border/50"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{moodConfig[todaysMood.mood].emoji}</span>
            <div>
              <p className="font-medium">
                Today you're feeling {moodConfig[todaysMood.mood].label.toLowerCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                Intensity: {todaysMood.intensity}/10
              </p>
              {todaysMood.note && (
                <p className="text-sm text-muted-foreground mt-1">
                  "{todaysMood.note}"
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              setSelectedMood(todaysMood.mood);
              setIntensity([todaysMood.intensity]);
              setNote(todaysMood.note);
            }}
          >
            Update Mood
          </Button>
        </motion.div>
      )}
    </div>
  );
};