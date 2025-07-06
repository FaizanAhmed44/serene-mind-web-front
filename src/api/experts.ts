import { expertApi } from "@/lib/expert_api";

export const ExpertsAPI = {
  getExperts: async () => expertApi.get("/experts").then((res) => res.data.data.experts),
  getExpert: async (id: string) => expertApi.get(`/experts/${id}`).then((res) => res.data.data.expert),
  availabilitySlots: async (id: string, date?: string) => {
    const params = date ? { date } : {};
    return expertApi.get(`/bookings/availability-slots/${id}`, { params }).then((res) => res.data.data);
  },
  sessionTypes: async (id: string) => expertApi.get(`/bookings/${id}/session-types`).then((res) => res.data.data),
  bookSession: async (expertId: string, data: any) => expertApi.post(`/bookings/${expertId}`, data).then((res) => res.data.data),
  getBookings: async (expertId: string) => expertApi.get(`/experts/${expertId}/bookings`).then((res) => res.data.data),
};