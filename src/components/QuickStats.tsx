import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { TrendingUp, TrendingDown, Minus, Calendar, BookOpen, Brain } from 'lucide-react';

export const QuickStats = () => {
  const { moodEntries, journalEntries, chatMessages } = useSupabaseData();
  
  const getRecentMoods = (days = 7) => {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return moodEntries.filter(entry => entry.timestamp > cutoff);
  };

  const getMoodTrend = () => {
    const recentMoods = getRecentMoods(7);
    if (recentMoods.length < 2) return 'stable';
    
    const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
    const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.intensity, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.intensity, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  };
  
  const moodTrend = getMoodTrend();
  const weeklyMoods = getRecentMoods(7);

  const stats = [
    {
      label: 'Mood Trend',
      value: moodTrend,
      icon: moodTrend === 'improving' ? TrendingUp : 
            moodTrend === 'declining' ? TrendingDown : Minus,
      color: moodTrend === 'improving' ? 'text-mood-happy' : 
             moodTrend === 'declining' ? 'text-mood-anxious' : 'text-mood-neutral',
      bgColor: moodTrend === 'improving' ? 'bg-mood-happy/10' : 
               moodTrend === 'declining' ? 'bg-mood-anxious/10' : 'bg-mood-neutral/10'
    },
    {
      label: 'Weekly Check-ins',
      value: weeklyMoods.length,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Journal Entries',
      value: journalEntries.length,
      icon: BookOpen,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'AI Conversations',
      value: Math.floor(chatMessages.length / 2), // Approximate conversations
      icon: Brain,
      color: 'text-mood-calm',
      bgColor: 'bg-mood-calm/10'
    }
  ];

  return (
    <Card className="shadow-gentle border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg ${stat.bgColor} flex items-center space-x-3`}
            >
              <div className={`p-2 rounded-full bg-white/50`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {stat.label}
                </p>
                <p className={`text-lg font-bold ${stat.color}`}>
                  {typeof stat.value === 'string' 
                    ? stat.value.charAt(0).toUpperCase() + stat.value.slice(1)
                    : stat.value
                  }
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};