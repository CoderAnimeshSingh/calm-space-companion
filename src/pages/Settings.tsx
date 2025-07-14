import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Download, 
  Trash2,
  Save,
  AlertTriangle
} from 'lucide-react';

export default function Settings() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    display_name: '',
    avatar_url: ''
  });
  const [settings, setSettings] = useState({
    notifications: true,
    dailyReminders: true,
    reminderTime: '20:00',
    dataExport: false,
    aiPersonality: 'zen'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          display_name: data.display_name || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportAllData = async () => {
    try {
      // Fetch all user data
      const [moodData, journalData, chatData] = await Promise.all([
        supabase.from('mood_entries').select('*').eq('user_id', user?.id),
        supabase.from('journal_entries').select('*').eq('user_id', user?.id),
        supabase.from('chat_messages').select('*').eq('user_id', user?.id)
      ]);

      const exportData = {
        profile,
        moodEntries: moodData.data || [],
        journalEntries: journalData.data || [],
        chatMessages: chatData.data || [],
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wellness-complete-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your complete wellness data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteAllData = async () => {
    if (!user) return;

    try {
      // Delete all user data
      await Promise.all([
        supabase.from('mood_entries').delete().eq('user_id', user.id),
        supabase.from('journal_entries').delete().eq('user_id', user.id),
        supabase.from('chat_messages').delete().eq('user_id', user.id)
      ]);

      toast({
        title: "Data Deleted",
        description: "All your wellness data has been permanently deleted.",
        variant: "destructive",
      });
      
      setShowDeleteConfirm(false);
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete data. Please try again.",
        variant: "destructive",
      });
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your wellness experience
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* Profile Settings */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-gentle border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={profile.display_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Enter your display name"
                />
              </div>

              <Button 
                onClick={saveProfile} 
                disabled={isSaving}
                className="bg-gradient-wellness hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-gentle border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-primary" />
                <span>Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-gentle border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for reminders and updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, notifications: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dailyReminders">Daily Check-in Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to track your mood daily
                  </p>
                </div>
                <Switch
                  id="dailyReminders"
                  checked={settings.dailyReminders}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, dailyReminders: checked }))
                  }
                />
              </div>

              {settings.dailyReminders && (
                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, reminderTime: e.target.value }))
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Settings */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-gentle border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                <span>AI Companion</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>AI Personality</Label>
                <Select 
                  value={settings.aiPersonality} 
                  onValueChange={(value) => 
                    setSettings(prev => ({ ...prev, aiPersonality: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zen">Zen - Calm and mindful</SelectItem>
                    <SelectItem value="friendly">Friendly - Warm and encouraging</SelectItem>
                    <SelectItem value="professional">Professional - Direct and informative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-gentle border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={exportAllData}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>

                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="w-full"
                >
                  Sign Out
                </Button>

                <Separator />

                {!showDeleteConfirm ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Data
                  </Button>
                ) : (
                  <Alert className="border-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="mb-3">
                      This action cannot be undone. This will permanently delete all your 
                      mood entries, journal entries, and chat history.
                    </AlertDescription>
                    <div className="flex space-x-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteAllData}
                      >
                        Yes, Delete Everything
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}