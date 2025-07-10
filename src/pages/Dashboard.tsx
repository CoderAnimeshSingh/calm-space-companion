import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { MoodQuickTracker } from '@/components/mood/MoodQuickTracker';
import { AffirmationCard } from '@/components/AffirmationCard';
import { QuickStats } from '@/components/QuickStats';
import { RecentJournals } from '@/components/RecentJournals';
import { MoodTrendChart } from '@/components/charts/MoodTrendChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, BookOpen, Heart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { moodEntries, journalEntries, getTodaysMood, getMoodTrend } = useAppStore();
  
  const todaysMood = getTodaysMood();
  const moodTrend = getMoodTrend();
  const recentEntries = journalEntries.slice(-3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to Your Wellness Journey
        </h1>
        <p className="text-muted-foreground">
          Take a moment to check in with yourself today
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Main Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mood Quick Tracker */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>How are you feeling today?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MoodQuickTracker />
              </CardContent>
            </Card>
          </motion.div>

          {/* Mood Trend Chart */}
          {moodEntries.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="shadow-gentle border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Your Mood Journey</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodTrendChart />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-gentle border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/chat">
                    <Button className="w-full h-20 flex flex-col space-y-2 bg-gradient-wellness hover:opacity-90">
                      <Brain className="h-6 w-6" />
                      <span>Talk to AI Companion</span>
                    </Button>
                  </Link>
                  <Link to="/journal">
                    <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 border-primary/20 hover:bg-primary/5">
                      <BookOpen className="h-6 w-6" />
                      <span>Write in Journal</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Stats and Quick Info */}
        <div className="space-y-6">
          {/* Daily Affirmation */}
          <motion.div variants={itemVariants}>
            <AffirmationCard />
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <QuickStats />
          </motion.div>

          {/* Recent Journals */}
          {recentEntries.length > 0 && (
            <motion.div variants={itemVariants}>
              <RecentJournals entries={recentEntries} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};