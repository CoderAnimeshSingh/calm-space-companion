import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import { moodConfig } from '@/utils/moodHelpers';

export const MoodTrendChart = () => {
  const { getRecentMoods } = useAppStore();
  const recentMoods = getRecentMoods(14); // Last 2 weeks

  const chartData = recentMoods
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      intensity: entry.intensity,
      mood: entry.mood,
      fullDate: entry.date
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const moodInfo = moodConfig[data.mood];
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-gentle">
          <p className="font-medium">{label}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-lg">{moodInfo.emoji}</span>
            <span className="text-sm">{moodInfo.label}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Intensity: {data.intensity}/10
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">Start tracking your mood to see trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis 
            domain={[1, 10]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="intensity"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#moodGradient)"
            dot={{ 
              fill: "hsl(var(--primary))", 
              strokeWidth: 2, 
              r: 4,
              stroke: "hsl(var(--background))"
            }}
            activeDot={{ 
              r: 6, 
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
              fill: "hsl(var(--background))"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};