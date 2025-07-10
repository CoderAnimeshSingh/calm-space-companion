import { Moon, Sun, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';

export const Header = () => {
  const { settings, updateSettings } = useAppStore();

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : 
                  currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-2xl font-bold bg-gradient-wellness bg-clip-text text-transparent"
          >
            🧠 Wellness
          </motion.div>
          
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground">
              {greeting}{settings.userName && `, ${settings.userName}`}
            </p>
            <p className="text-xs text-muted-foreground">
              How are you feeling today?
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {settings.dailyReminders && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="hover:bg-muted"
          >
            {settings.theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-muted"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};