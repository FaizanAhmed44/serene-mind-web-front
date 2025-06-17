
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useExperts = () => {
  return useQuery({
    queryKey: ['experts'],
    queryFn: async () => {
      const { data: experts, error } = await supabase
        .from('experts')
        .select(`
          *,
          sessionTypes:expert_session_types(*),
          availability:expert_availability(*)
        `);
      
      if (error) throw error;
      
      // Transform the data to match the expected format
      return experts.map((expert: any) => ({
        id: expert.id,
        name: expert.name,
        title: expert.title,
        specializations: expert.specializations,
        rating: parseFloat(expert.rating),
        reviews: expert.reviews,
        experience: expert.experience,
        verified: expert.verified,
        nextAvailable: expert.next_available,
        photo: expert.photo,
        bio: expert.bio,
        sessionTypes: expert.sessionTypes.map((session: any) => ({
          type: session.type,
          duration: session.duration,
          price: session.price
        })),
        availability: expert.availability.reduce((acc: any, avail: any) => {
          const existingDay = acc.find((day: any) => day.date === avail.date);
          if (existingDay) {
            existingDay.times = [...existingDay.times, ...avail.times];
          } else {
            acc.push({
              date: avail.date,
              times: avail.times
            });
          }
          return acc;
        }, [])
      }));
    },
  });
};

export const useExpert = (expertId: string) => {
  return useQuery({
    queryKey: ['expert', expertId],
    queryFn: async () => {
      const { data: expert, error } = await supabase
        .from('experts')
        .select(`
          *,
          sessionTypes:expert_session_types(*),
          availability:expert_availability(*)
        `)
        .eq('id', expertId) // Use string id directly since experts table uses UUID
        .maybeSingle(); // Use maybeSingle to avoid errors when no data found
      
      if (error) throw error;
      if (!expert) return null;
      
      // Transform the data to match the expected format
      return {
        id: expert.id,
        name: expert.name,
        title: expert.title,
        specializations: expert.specializations,
        rating: parseFloat(expert.rating),
        reviews: expert.reviews,
        experience: expert.experience,
        verified: expert.verified,
        nextAvailable: expert.next_available,
        photo: expert.photo,
        bio: expert.bio,
        sessionTypes: expert.sessionTypes.map((session: any) => ({
          type: session.type,
          duration: session.duration,
          price: session.price
        })),
        availability: expert.availability.reduce((acc: any, avail: any) => {
          const existingDay = acc.find((day: any) => day.date === avail.date);
          if (existingDay) {
            existingDay.times = [...existingDay.times, ...avail.times];
          } else {
            acc.push({
              date: avail.date,
              times: avail.times
            });
          }
          return acc;
        }, [])
      };
    },
    enabled: !!expertId,
  });
};
