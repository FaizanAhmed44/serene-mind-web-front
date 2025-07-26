import { expertApi } from "@/lib/expert_api";
import { GetTrainingSessionsResponse, TrainingSession } from "@/data/types/training";
import axios from "../lib/axios";


export const CoursesExpertAPI = {
  getCourses: async () => expertApi.get("/courses").then((res) => res.data.data.courses),
  getCourse: async (id: string) => expertApi.get(`/courses/${id}`).then((res) => res.data.data),
  getEnrollment: async (userId: string) => expertApi.get(`/courses/${userId}/enrolled/`).then((res) => res.data.data),
  enrollCourse: async (courseId: string, userId: string) => expertApi.put(`/courses/${courseId}/enroll/`, { userId }).then((res) => res.data),
  getBooking: async (userId: string) => expertApi.get(`/bookings/user-bookings/${userId}`).then((res) => res.data.data),  
  getCourseProgress: async (courseId: string) => {
    const response = await axios.get(`/progress/courses/${courseId}/progress`);
    return response.data;
  },
  markLessonComplete: async (courseId: string, lessonId: string) => {
    const response = await axios.post(`/progress/courses/${courseId}/lessons/${lessonId}/complete`);
    return response.data;
  }, 

  // New Review APIs
  addCourseReview: async (courseId: string, userId: string, review: { rating: number; comment: string; userName: string }) =>
    expertApi.post(`/courses/${courseId}/users/${userId}/review`, review).then((res) => res.data),

  updateCourseReview: async (courseId: string, userId: string, review: { rating: number; comment: string; userName: string }) =>
    expertApi.put(`/courses/${courseId}/users/${userId}/review`, review).then((res) => res.data),

  getCourseReviews: async (courseId: string) =>
    expertApi.get(`/courses/${courseId}/reviews`).then((res) => res.data.data),

  getUserCourseReview: async (courseId: string, userId: string) =>
    expertApi.get(`/courses/${courseId}/users/${userId}/review`).then((res) => res.data.data),

};