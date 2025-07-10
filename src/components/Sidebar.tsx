import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Settings,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: Home,
    description: 'Your wellness overview'
  },
  { 
    name: 'AI Chat', 
    href: '/chat', 
    icon: Brain,
    description: 'Talk to your companion'
  },
  { 
    name: 'Mood Tracker', 
    href: '/mood', 
    icon: Heart,
    description: 'Track your emotions'
  },
  { 
    name: 'Journal', 
    href: '/journal', 
    icon: BookOpen,
    description: 'Write your thoughts'
  },
  { 
    name: 'Progress', 
    href: '/progress', 
    icon: TrendingUp,
    description: 'View your journey'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    description: 'Personalize your app'
  }
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 bg-card/60 backdrop-blur-sm border-r border-border"
    >
      <div className="p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex items-center space-x-3 mb-8"
        >
          <div className="w-10 h-10 bg-gradient-wellness rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">🧠</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Mental Wellness</h2>
            <p className="text-xs text-muted-foreground">Your companion</p>
          </div>
        </motion.div>

        <nav className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-gentle"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isActive 
                        ? "text-primary" 
                        : "group-hover:text-foreground"
                    )} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      isActive ? "text-primary" : ""
                    )}>
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-1 h-6 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-gradient-calm rounded-lg"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🌱</div>
            <h3 className="text-sm font-medium text-white mb-1">
              Daily Progress
            </h3>
            <p className="text-xs text-white/80">
              Keep nurturing your mental wellness
            </p>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  );
};