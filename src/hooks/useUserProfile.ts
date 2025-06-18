
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
  avatar: string;
}

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      // If no profile exists, create one
      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.user_metadata?.full_name || '',
            email: user.email || '',
            phone: '',
            location: '',
            bio: '',
            avatar: user.user_metadata?.avatar_url || '/placeholder.svg'
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        
        return {
          id: newProfile.id,
          name: newProfile.name || '',
          email: newProfile.email || '',
          phone: newProfile.phone || '',
          location: newProfile.location || '',
          bio: newProfile.bio || '',
          joinDate: new Date(newProfile.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          }),
          avatar: newProfile.avatar || '/placeholder.svg'
        };
      }
      
      return {
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        joinDate: new Date(profile.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }),
        avatar: profile.avatar || '/placeholder.svg'
      };
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: UserData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
          bio: userData.bio,
          avatar: userData.avatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        joinDate: new Date(data.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }),
        avatar: data.avatar || '/placeholder.svg'
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user-profile'], data);
    },
  });
};
