
// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/integrations/supabase/client';
// import { Expert } from '@/data/types/expert';

// export const useExperts = () => {
//   return useQuery({
//     queryKey: ['experts'],
//     queryFn: async (): Promise<Expert[]> => {
//       const { data: experts, error } = await supabase
//         .from('experts')
//         .select(`
//           *,
//           sessionTypes:expert_session_types(*),
//           availability:expert_availability(*)
//         `);
      
//       if (error) throw error;
      
//       // Transform the data to match the expected format
//       return experts.map((expert: any): Expert => ({
//         id: expert.id,
//         name: expert.name,
//         title: expert.title,
//         specializations: expert.specializations,
//         rating: parseFloat(expert.rating),
//         reviews: expert.reviews,
//         experience: expert.experience,
//         verified: expert.verified,
//         nextAvailable: expert.next_available,
//         photo: expert.photo,
//         bio: expert.bio,
//         sessionTypes: expert.sessionTypes.map((session: any) => ({
//           type: session.type,
//           duration: session.duration,
//           price: session.price
//         })),
//         availability: expert.availability.reduce((acc: any, avail: any) => {
//           const existingDay = acc.find((day: any) => day.date === avail.date);
//           if (existingDay) {
//             existingDay.times = [...existingDay.times, ...avail.times];
//           } else {
//             acc.push({
//               date: avail.date,
//               times: avail.times
//             });
//           }
//           return acc;
//         }, [])
//       }));
//     },
//   });
// };

// export const useExpert = (expertId: string) => {
//   return useQuery({
//     queryKey: ['expert', expertId],
//     queryFn: async (): Promise<Expert | null> => {
//       if (!expertId) {
//         throw new Error('Expert ID is required');
//       }
      
//       const { data: expert, error } = await supabase
//         .from('experts')
//         .select(`
//           *,
//           sessionTypes:expert_session_types(*),
//           availability:expert_availability(*)
//         `)
//         .eq('id', expertId)
//         .maybeSingle();
      
//       if (error) throw error;
//       if (!expert) return null;
      
//       // Transform the data to match the expected format
//       return {
//         id: String(expert.id),
//         name: expert.name,
//         title: expert.title,
//         specializations: expert.specializations,
//         rating: parseFloat(expert.rating.toString()),
//         reviews: expert.reviews,
//         experience: expert.experience,
//         verified: expert.verified,
//         nextAvailable: expert.next_available,
//         photo: expert.photo,
//         bio: expert.bio,
//         sessionTypes: expert.sessionTypes.map((session: any) => ({
//           type: session.type,
//           duration: session.duration,
//           price: session.price,
//           session_id: session.id
//         })),
//         availability: expert.availability.reduce((acc: any, avail: any) => {
//           const existingDay = acc.find((day: any) => day.date === avail.date);
//           if (existingDay) {
//             existingDay.times = [...existingDay.times, ...avail.times];
//           } else {
//             acc.push({
//               date: avail.date,
//               times: avail.times
//             });
//           }
//           return acc;
//         }, [])
//       };
//     },
//     enabled: !!expertId,
//   });
// };

// src/hooks/useExperts.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Expert } from '@/data/types/expert';

const transformExpert = (expert: any): Expert => ({
  id: expert.id,
  name: expert.name,
  title: expert.title || '',
  specializations: expert.specializations || [],
  rating: expert.rating ?? 0,
  reviews: expert.totalStudents ?? 0,
  experience: expert.experience || '',
  verified: expert.verified ?? false,
  credentials: expert.credentials || [],
  nextAvailable: 'N/A', // You can replace with real field if your backend supports it
  photo: expert.avatar || 'https://via.placeholder.com/150', // fallback avatar
  bio: expert.bio || '',
  sessionTypes: [], // backend doesn’t provide this yet
  availability: []  // backend doesn’t provide this yet
});

export const useExperts = () => {
  return useQuery({
    queryKey: ['experts'],
    queryFn: async (): Promise<Expert[]> => {
      const res = await api.get('/experts');
      const experts = res.data.experts;
      return experts.map(transformExpert);
    },
  });
};

export const useExpert = (expertId: string) => {
  return useQuery({
    queryKey: ['expert', expertId],
    queryFn: async (): Promise<Expert | null> => {
      if (!expertId) throw new Error('Expert ID is required');
      const res = await api.get(`/experts/${expertId}`);
      const expert = res.data.expert.expert;
      return transformExpert(expert);
    },
    enabled: !!expertId,
  });
};



// src/hooks/useExperts.ts

// import { useQuery } from '@tanstack/react-query';
// import api from '@/lib/axios';
// import { Expert } from '@/data/types/expert';

// export const useExperts = () => {
//   return useQuery({
//     queryKey: ['experts'],
//     queryFn: async (): Promise<Expert[]> => {
//       const response = await api.get('/experts'); // uses VITE_API_BASE_URL + /experts
//       const experts = response.data.experts;

//       return experts.map((expert: any): Expert => ({
//         id: expert.id,
//         name: expert.name,
//         title: expert.title || '',
//         bio: expert.bio || '',
//         avatar: expert.avatar || '',

//         // Arrays may be undefined
//         credentials: expert.credentials || [],
//         specializations: expert.specializations || [],

//         rating: expert.rating ?? 0,
//         totalCourses: expert.totalCourses ?? 0,
//         totalStudents: expert.totalStudents ?? 0,
//         experience: expert.experience || '',

//         // These are for frontend compatibility
//         reviews: Math.floor(Math.random() * 300), // Fake data for display
//         nextAvailable: 'Tomorrow', // Placeholder
//         photo: expert.avatar || '', // For UI compatibility
//         sessionTypes: [],
//         availability: []
//       }));
//     }
//   });
// };
