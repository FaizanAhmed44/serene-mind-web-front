import { expertApi } from "@/lib/expert_api";

export const CoursesExpertAPI = {
  getCourses: async () => expertApi.get("/courses").then((res) => res.data.data.courses),
  getCourse: async (id: string) => expertApi.get(`/courses/${id}`).then((res) => res.data),
  getEnrollment: async (userId: string) => expertApi.get(`/courses/${userId}/enrolled/`).then((res) => res.data),
  enrollCourse: async (courseId: string, userId: string) => expertApi.put(`/courses/${courseId}/enroll/`, { userId }).then((res) => res.data),
}