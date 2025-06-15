
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Stat } from '@/data/types/stats';

export const useStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match the Stat type
      return data.map((stat: any): Stat => ({
        label: stat.label,
        value: stat.value,
        icon: stat.icon as any // Type assertion for icon
      }));
    },
  });
};
