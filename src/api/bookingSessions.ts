import { expertApi } from "@/lib/expert_api";


export const BookingSessionsAPI = { 
  getBooking: async (userId: string) => expertApi.get(`/bookings/user-bookings/${userId}`).then((res) => res.data.data),  
  getBookingLength: async (userId: string) => expertApi.get(`/bookings/user-bookings/${userId}`).then((res) => res.data.data.length),  
}

