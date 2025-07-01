import { expertApi } from "@/lib/expert_api";

export const CoursesExpertAPI = {
  getCourses: async () => expertApi.get("/courses").then((res) => res.data.data.courses),
  getCourse: async (id: string) => expertApi.get(`/courses/${id}`).then((res) => res.data),
}