import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentJournals = () => {
  const { journalEntries } = useSupabaseData();
  const navigate = useNavigate();
  
  const recentEntries = journalEntries.slice(0, 3);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card className="shadow-gentle border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Recent Journals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentEntries.length > 0 ? (
          <>
            {recentEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-muted/30 rounded-lg border border-border/30"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm truncate flex-1">
                    {entry.title || 'Untitled Entry'}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {truncateContent(entry.content)}
                </p>
              </motion.div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-4 group"
              onClick={() => navigate('/journal')}
            >
              <span>View All Entries</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </>
        ) : (
          <div className="text-center py-6">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No journal entries yet
            </p>
            <Button 
              onClick={() => navigate('/journal')}
              className="text-sm"
            >
              Start Journaling
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};