import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart } from 'lucide-react';
import { getRandomAffirmation } from '@/utils/moodHelpers';
import { useState } from 'react';

export const AffirmationCard = () => {
  const [affirmation, setAffirmation] = useState(getRandomAffirmation());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAffirmation = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAffirmation(getRandomAffirmation());
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <Card className="shadow-mood border-primary/20 bg-gradient-warm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span className="text-lg">Daily Affirmation</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshAffirmation}
            disabled={isRefreshing}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          key={affirmation}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-white font-medium italic text-lg leading-relaxed">
            "{affirmation}"
          </p>
          <div className="mt-4 flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl"
            >
              ✨
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};