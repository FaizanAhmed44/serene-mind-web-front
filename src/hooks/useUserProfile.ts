
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from './useAuth';

// export interface UserProfile {
//   id: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   location?: string;
//   bio?: string;
//   avatar?: string;
// }

// export const useUserProfile = () => {
//   const { user } = useAuth();
  
//   return useQuery({
//     queryKey: ['userProfile', user?.id],
//     queryFn: async (): Promise<UserProfile | null> => {
//       if (!user?.id) return null;
      
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', user.id)
//         .maybeSingle();
      
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!user?.id,
//   });
// };

// export const useUpdateUserProfile = () => {
//   const queryClient = useQueryClient();
//   const { user } = useAuth();
  
//   return useMutation({
//     mutationFn: async (profileData: Partial<UserProfile>) => {
//       if (!user?.id) throw new Error('User not authenticated');
      
//       const { data, error } = await supabase
//         .from('profiles')
//         .update(profileData)
//         .eq('id', user.id)
//         .select()
//         .single();
      
//       if (error) throw error;
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
//     },
//   });
// };
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios'; // this is your configured axios
import { User } from '@/data/types/auth';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<User> => {
      const res = await api.get('/profile');
      return res.data.user; // because your controller returns { user: { ... } }
    }
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      const res = await api.put('/profile', profileData);
      return res.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }
  });
};
