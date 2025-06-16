
import { useQuery } from '@tanstack/react-query';

// Mock expert data until we have a proper database table
const mockExperts = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    specializations: ["Anxiety Disorders", "CBT", "Mindfulness"],
    rating: 4.9,
    reviews: 127,
    experience: "12+ years",
    verified: true,
    nextAvailable: "Tomorrow, 2:00 PM",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    bio: "Specializes in cognitive behavioral therapy for anxiety and depression. Expert in mindfulness-based interventions.",
    sessionTypes: [
      { type: "One-on-One Therapy", duration: "50 min", price: "$120" },
      { type: "CBT Session", duration: "50 min", price: "$110" },
      { type: "Mindfulness Coaching", duration: "45 min", price: "$90" }
    ],
    availability: [
      { date: "Today", times: ["2:00 PM", "4:00 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "2:00 PM", "5:00 PM"] },
      { date: "Friday", times: ["9:00 AM", "1:00 PM", "3:00 PM"] }
    ]
  },
  {
    id: 2,
    name: "Mark Thompson",
    title: "Speech & Confidence Coach",
    specializations: ["Public Speaking", "Social Anxiety", "Confidence Building"],
    rating: 4.8,
    reviews: 89,
    experience: "8+ years",
    verified: true,
    nextAvailable: "Today, 4:30 PM",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Former corporate trainer turned therapist, helping individuals overcome public speaking fears and build confidence.",
    sessionTypes: [
      { type: "Public Speaking Coaching", duration: "50 min", price: "$100" },
      { type: "Confidence Building", duration: "45 min", price: "$85" },
      { type: "Group Workshop", duration: "90 min", price: "$60" }
    ],
    availability: [
      { date: "Today", times: ["4:30 PM", "6:00 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { date: "Friday", times: ["9:00 AM", "11:00 AM", "3:00 PM"] }
    ]
  }
];

export const useExperts = () => {
  return useQuery({
    queryKey: ['experts'],
    queryFn: async () => {
      // For now, return mock data. In the future, this would query Supabase
      return mockExperts;
    },
  });
};

export const useExpert = (expertId: string) => {
  return useQuery({
    queryKey: ['expert', expertId],
    queryFn: async () => {
      // For now, find from mock data. In the future, this would query Supabase
      const expert = mockExperts.find(expert => expert.id === parseInt(expertId));
      if (!expert) {
        throw new Error('Expert not found');
      }
      return expert;
    },
    enabled: !!expertId,
  });
};
