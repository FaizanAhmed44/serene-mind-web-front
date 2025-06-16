
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, User, TrendingUp, CheckCircle } from 'lucide-react';

const iconMap = {
  Calendar,
  Clock,
  User,
  TrendingUp,
  CheckCircle,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      
      // Transform the data and map icons
      return data.map((stat: any) => ({
        title: stat.label,
        value: stat.value,
        icon: iconMap[stat.icon as keyof typeof iconMap] || TrendingUp,
        change: "+2 this month" // You can make this dynamic based on your needs
      }));
    },
  });
};
