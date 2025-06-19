export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booked_sessions: {
        Row: {
          created_at: string
          id: number
          notes: string | null
          session_id: string | null
          session_time: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          notes?: string | null
          session_id?: string | null
          session_time: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          notes?: string | null
          session_id?: string | null
          session_time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booked_sessions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "expert_session_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booked_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: number | null
          created_at: string | null
          duration: string
          id: string
          lessons: string[] | null
          title: string
          week: number
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          duration: string
          id?: string
          lessons?: string[] | null
          title: string
          week: number
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          duration?: string
          id?: string
          lessons?: string[] | null
          title?: string
          week?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          comment: string
          course_id: number | null
          created_at: string | null
          id: string
          rating: number
          review_date: string
          reviewer_name: string
        }
        Insert: {
          comment: string
          course_id?: number | null
          created_at?: string | null
          id?: string
          rating: number
          review_date: string
          reviewer_name: string
        }
        Update: {
          comment?: string
          course_id?: number | null
          created_at?: string | null
          id?: string
          rating?: number
          review_date?: string
          reviewer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          certificate: boolean
          created_at: string | null
          description: string
          duration: string
          id: number
          image: string
          instructor_id: string | null
          language: string
          level: Database["public"]["Enums"]["course_level"]
          long_description: string
          modules: number
          original_price: number | null
          outcomes: string[] | null
          price: string
          progress: number | null
          rating: number
          students: number
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          certificate?: boolean
          created_at?: string | null
          description: string
          duration: string
          id?: number
          image: string
          instructor_id?: string | null
          language?: string
          level?: Database["public"]["Enums"]["course_level"]
          long_description: string
          modules: number
          original_price?: number | null
          outcomes?: string[] | null
          price: string
          progress?: number | null
          rating?: number
          students?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          certificate?: boolean
          created_at?: string | null
          description?: string
          duration?: string
          id?: number
          image?: string
          instructor_id?: string | null
          language?: string
          level?: Database["public"]["Enums"]["course_level"]
          long_description?: string
          modules?: number
          original_price?: number | null
          outcomes?: string[] | null
          price?: string
          progress?: number | null
          rating?: number
          students?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_stats: {
        Row: {
          created_at: string | null
          icon: string
          id: string
          label: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          icon: string
          id?: string
          label: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          icon?: string
          id?: string
          label?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      enrolled_courses: {
        Row: {
          course_id: number | null
          enrolled_at: string | null
          id: string
          next_lesson: string | null
          progress: number | null
          time_spent: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: number | null
          enrolled_at?: string | null
          id?: string
          next_lesson?: string | null
          progress?: number | null
          time_spent?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: number | null
          enrolled_at?: string | null
          id?: string
          next_lesson?: string | null
          progress?: number | null
          time_spent?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrolled_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_availability: {
        Row: {
          created_at: string
          date: string
          expert_id: string | null
          id: string
          times: string[]
        }
        Insert: {
          created_at?: string
          date: string
          expert_id?: string | null
          id?: string
          times?: string[]
        }
        Update: {
          created_at?: string
          date?: string
          expert_id?: string | null
          id?: string
          times?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "expert_availability_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_session_types: {
        Row: {
          created_at: string
          duration: string
          expert_id: string | null
          id: string
          price: string
          type: string
        }
        Insert: {
          created_at?: string
          duration: string
          expert_id?: string | null
          id?: string
          price: string
          type: string
        }
        Update: {
          created_at?: string
          duration?: string
          expert_id?: string | null
          id?: string
          price?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_session_types_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      experts: {
        Row: {
          bio: string | null
          created_at: string
          experience: string
          id: string
          name: string
          next_available: string | null
          photo: string | null
          rating: number
          reviews: number
          specializations: string[]
          title: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          bio?: string | null
          created_at?: string
          experience: string
          id?: string
          name: string
          next_available?: string | null
          photo?: string | null
          rating?: number
          reviews?: number
          specializations?: string[]
          title: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          bio?: string | null
          created_at?: string
          experience?: string
          id?: string
          name?: string
          next_available?: string | null
          photo?: string | null
          rating?: number
          reviews?: number
          specializations?: string[]
          title?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      instructors: {
        Row: {
          bio: string
          created_at: string | null
          id: string
          name: string
          photo: string
          title: string
          updated_at: string | null
        }
        Insert: {
          bio: string
          created_at?: string | null
          id?: string
          name: string
          photo: string
          title: string
          updated_at?: string | null
        }
        Update: {
          bio?: string
          created_at?: string | null
          id?: string
          name?: string
          photo?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          location?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          can_review: boolean
          created_at: string | null
          duration: string
          expert_name: string
          has_reviewed: boolean
          id: number
          session_date: string
          session_type: string
          status: Database["public"]["Enums"]["session_status"]
          updated_at: string | null
        }
        Insert: {
          can_review?: boolean
          created_at?: string | null
          duration: string
          expert_name: string
          has_reviewed?: boolean
          id?: number
          session_date: string
          session_type: string
          status: Database["public"]["Enums"]["session_status"]
          updated_at?: string | null
        }
        Update: {
          can_review?: boolean
          created_at?: string | null
          duration?: string
          expert_name?: string
          has_reviewed?: boolean
          id?: number
          session_date?: string
          session_type?: string
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      course_level: "Beginner" | "Intermediate" | "Advanced"
      session_status: "upcoming" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      course_level: ["Beginner", "Intermediate", "Advanced"],
      session_status: ["upcoming", "completed"],
    },
  },
} as const
