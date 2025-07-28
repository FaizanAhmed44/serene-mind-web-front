// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import api from '@/lib/axios'; // this is your configured axios
// import { User } from '@/data/types/auth';

//   export const useUserProfile = () => {
//     return useQuery({
//       queryKey: ['userProfile'],
//       queryFn: async (): Promise<User> => {
//         const res = await api.get('/profile');
//         return res.data.user; // because your controller returns { user: { ... } }
//       }
//     });
//   };

// export const useUpdateUserProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (profileData: Partial<User>) => {
//       const res = await api.put('/profile', profileData);
//       return res.data.user;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['userProfile'] });
//     }
//   });
// };

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { User } from '@/data/types/auth';
import { useAuth } from '@/hooks/useAuth';

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<User> => {
      const res = await api.get('/profile');
      const user = res.data.user;
      return {
        ...user,
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        avatar: user.avatar || '',
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || new Date().toISOString(),
        email_verified: user.email_verified ?? false,
      };
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (profileData: Partial<User>) => {
      const res = await api.put('/profile', profileData);
      return res.data.user as User;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
    },
  });
};
