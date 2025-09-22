import api from "@/lib/axios";
import { AssesmentSubmission, Quiz, QuizSubmission } from "@/pages/assesment/types";

export const AssesmentsAPI = {
  getAssesments: async () => api.get<Quiz[]>("/assesments").then((res) => res.data),
  getAssesment: async (id: string) => api.get<Quiz>(`/assesments/${id}`).then((res) => res.data),
  submitAssesment: async (id: string, data: AssesmentSubmission) => api.post(`/assesments/${id}/submit`, data).then((res) => res.data),
  getLatestSubmission: async (id: string) => api.get<QuizSubmission>(`/assesments/${id}/submissions/latest`).then((res) => res.data),
}