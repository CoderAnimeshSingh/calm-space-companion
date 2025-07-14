import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  BarChart3, 
  LineChart, 
  Download,
  RefreshCw
} from 'lucide-react';
import { MoodTrendChart } from '@/components/charts/MoodTrendChart';
import { moodConfig } from '@/utils/moodHelpers';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export default function Progress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('week');
  const [moodEntries, setMoodEntries] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [stats, setStats] = useState({
    totalMoodEntries: 0,
    totalJournalEntries: 0,
    averageMood: 0,
    streakDays: 0,
    mostCommonMood: 'neutral',
    moodImprovement: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, timeRange]);

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case '3months':
        return { start: subDays(now, 90), end: now };
      case 'year':
        return { start: subDays(now, 365), end: now };
      default:
        return { start: startOfWeek(now), end: endOfWeek(now) };
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { start, end } = getDateRange();
      
      // Fetch mood entries
      const { data: moods, error: moodError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true });

      if (moodError) throw moodError;

      // Fetch journal entries
      const { data: journals, error: journalError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true });

      if (journalError) throw journalError;

      setMoodEntries(moods || []);
      setJournalEntries(journals || []);
      calculateStats(moods || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load progress data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (moods: any[]) => {
    if (moods.length === 0) {
      setStats({
        totalMoodEntries: 0,
        totalJournalEntries: journalEntries.length,
        averageMood: 0,
        streakDays: 0,
        mostCommonMood: 'neutral',
        moodImprovement: 0
      });
      return;
    }

    // Calculate average mood intensity
    const averageMood = moods.reduce((sum, entry) => sum + entry.intensity, 0) / moods.length;

    // Find most common mood
    const moodCounts = moods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    // Calculate mood improvement (compare first half to second half)
    const midpoint = Math.floor(moods.length / 2);
    const firstHalf = moods.slice(0, midpoint);
    const secondHalf = moods.slice(midpoint);
    
    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((sum, entry) => sum + entry.intensity, 0) / firstHalf.length 
      : 0;
    const secondHalfAvg = secondHalf.length > 0 
      ? secondHalf.reduce((sum, entry) => sum + entry.intensity, 0) / secondHalf.length 
      : 0;
    
    const moodImprovement = secondHalfAvg - firstHalfAvg;

    // Calculate streak (simplified - consecutive days with entries)
    const streakDays = calculateStreak(moods);

    setStats({
      totalMoodEntries: moods.length,
      totalJournalEntries: journalEntries.length,
      averageMood,
      streakDays,
      mostCommonMood,
      moodImprovement
    });
  };

  const calculateStreak = (moods: any[]) => {
    // Simplified streak calculation
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = format(subDays(today, i), 'yyyy-MM-dd');
      const hasEntry = moods.some(mood => 
        format(new Date(mood.created_at), 'yyyy-MM-dd') === checkDate
      );
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const exportData = async () => {
    try {
      const data = {
        moodEntries,
        journalEntries,
        stats,
        exportDate: new Date().toISOString(),
        timeRange
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wellness-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your wellness data has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const achievements = [
    {
      id: 'first-entry',
      title: 'First Steps',
      description: 'Logged your first mood entry',
      icon: '🌱',
      completed: stats.totalMoodEntries > 0
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintained a 7-day tracking streak',
      icon: '🔥',
      completed: stats.streakDays >= 7
    },
    {
      id: 'journal-writer',
      title: 'Story Teller',
      description: 'Written 10 journal entries',
      icon: '📖',
      completed: stats.totalJournalEntries >= 10
    },
    {
      id: 'mood-tracker',
      title: 'Emotion Explorer',
      description: 'Logged 50 mood entries',
      icon: '🎯',
      completed: stats.totalMoodEntries >= 50
    }
  ];

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
        className="flex flex-col md:flex-row md:items-center md:justify-between py-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Progress Tracking
          </h1>
          <p className="text-muted-foreground">
            Visualize your wellness journey and celebrate your achievements
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="shadow-gentle border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Mood Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-primary mr-2" />
                    <span className="text-2xl font-bold">{stats.totalMoodEntries}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-gentle border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Mood
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-primary mr-2" />
                    <span className="text-2xl font-bold">
                      {stats.averageMood.toFixed(1)}/10
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-gentle border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-primary mr-2" />
                    <span className="text-2xl font-bold">{stats.streakDays}</span>
                    <span className="text-sm text-muted-foreground ml-1">days</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-gentle border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Most Common Mood
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">
                      {moodConfig[stats.mostCommonMood]?.emoji || '😐'}
                    </span>
                    <span className="text-lg font-bold">
                      {moodConfig[stats.mostCommonMood]?.label || 'Neutral'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <span>Mood Trend</span>
                  {stats.moodImprovement !== 0 && (
                    <Badge 
                      variant={stats.moodImprovement > 0 ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {stats.moodImprovement > 0 ? '+' : ''}{stats.moodImprovement.toFixed(1)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MoodTrendChart />
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border ${
                        achievement.completed
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-muted/20'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            achievement.completed ? 'text-primary' : 'text-muted-foreground'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.completed && (
                          <Badge className="bg-primary text-primary-foreground">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}