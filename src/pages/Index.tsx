import { motion } from 'framer-motion';
import { Brain, Heart, BookOpen, MessageCircle, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Heart,
      title: 'Mood Tracking',
      description: 'Track your daily emotions and see patterns over time with beautiful visualizations.'
    },
    {
      icon: MessageCircle,
      title: 'AI Companion',
      description: 'Chat with Zen, your personal AI wellness coach for support and guidance.'
    },
    {
      icon: BookOpen,
      title: 'Digital Journal',
      description: 'Write and reflect on your thoughts in a private, secure digital space.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Insights',
      description: 'Get meaningful insights into your mental health journey and celebrate progress.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and secure. Your mental health journey stays private.'
    },
    {
      icon: Brain,
      title: 'Science-Based',
      description: 'Built on proven psychological techniques and evidence-based wellness practices.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Your Personal
              <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"> Mental Wellness </span>
              Companion
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Track your mood, chat with an AI companion, journal your thoughts, and build healthy mental wellness habits—all in one beautiful, private space.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/auth')}
            >
              Start Your Wellness Journey
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Everything you need for mental wellness
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Comprehensive tools designed to support your mental health journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-primary-200 dark:border-primary-800">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to prioritize your mental wellness?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands who have started their journey to better mental health
            </p>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white text-primary-600 hover:bg-gray-50 border-white px-8 py-3 text-lg font-semibold rounded-full"
              onClick={() => navigate('/auth')}
            >
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}