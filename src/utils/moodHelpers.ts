import { MoodType } from '@/store/useAppStore';

export const moodConfig: Record<MoodType, {
  emoji: string;
  color: string;
  gradient: string;
  label: string;
  description: string;
}> = {
  happy: {
    emoji: '😊',
    color: 'mood-happy',
    gradient: 'from-green-400 to-green-500',
    label: 'Happy',
    description: 'Feeling joyful and content'
  },
  calm: {
    emoji: '😌',
    color: 'mood-calm',
    gradient: 'from-blue-400 to-teal-500',
    label: 'Calm',
    description: 'Peaceful and relaxed'
  },
  excited: {
    emoji: '🤩',
    color: 'mood-excited',
    gradient: 'from-yellow-400 to-orange-500',
    label: 'Excited',
    description: 'Energetic and enthusiastic'
  },
  anxious: {
    emoji: '😰',
    color: 'mood-anxious',
    gradient: 'from-orange-400 to-red-400',
    label: 'Anxious',
    description: 'Feeling worried or stressed'
  },
  sad: {
    emoji: '😢',
    color: 'mood-sad',
    gradient: 'from-blue-500 to-indigo-600',
    label: 'Sad',
    description: 'Feeling down or melancholy'
  },
  angry: {
    emoji: '😠',
    color: 'mood-angry',
    gradient: 'from-red-500 to-red-600',
    label: 'Angry',
    description: 'Feeling frustrated or upset'
  },
  neutral: {
    emoji: '😐',
    color: 'mood-neutral',
    gradient: 'from-gray-400 to-gray-500',
    label: 'Neutral',
    description: 'Feeling balanced, neither good nor bad'
  }
};

export const getMoodColor = (mood: MoodType): string => {
  return moodConfig[mood].color;
};

export const getMoodEmoji = (mood: MoodType): string => {
  return moodConfig[mood].emoji;
};

export const getMoodGradient = (mood: MoodType): string => {
  return moodConfig[mood].gradient;
};

export const getAllMoodTypes = (): MoodType[] => {
  return Object.keys(moodConfig) as MoodType[];
};

export const formatMoodIntensity = (intensity: number): string => {
  if (intensity <= 2) return 'Very Low';
  if (intensity <= 4) return 'Low';
  if (intensity <= 6) return 'Moderate';
  if (intensity <= 8) return 'High';
  return 'Very High';
};

export const getDailyAffirmations = (): string[] => {
  return [
    "You are stronger than you think.",
    "Every small step forward is progress.",
    "Your feelings are valid and temporary.",
    "You have overcome challenges before, and you will again.",
    "It's okay to take things one day at a time.",
    "You deserve kindness, especially from yourself.",
    "Your mental health matters and is worth prioritizing.",
    "You are not alone in this journey.",
    "Growth happens outside your comfort zone.",
    "Today is a new opportunity to be gentle with yourself."
  ];
};

export const getRandomAffirmation = (): string => {
  const affirmations = getDailyAffirmations();
  return affirmations[Math.floor(Math.random() * affirmations.length)];
};