
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
  avatar: string;
}

// Mock user data until we have proper authentication and database integration
const mockUserData: UserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  bio: "Passionate learner focused on mental wellness and personal development. Interested in mindfulness, cognitive behavioral therapy, and building healthy habits.",
  joinDate: "January 2024",
  avatar: "/placeholder.svg"
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      // For now, return mock data. In the future, this would query Supabase
      return mockUserData;
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: UserData) => {
      // For now, simulate API call. In the future, this would update Supabase
      await new Promise(resolve => setTimeout(resolve, 500));
      return userData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user-profile'], data);
    },
  });
};
