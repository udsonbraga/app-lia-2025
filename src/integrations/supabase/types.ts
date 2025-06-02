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
      accounts_user: {
        Row: {
          created_at: string
          date_joined: string
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          is_staff: boolean
          is_superuser: boolean
          last_login: string | null
          last_name: string | null
          name: string
          password: string
          phone: string | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          date_joined?: string
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          is_staff?: boolean
          is_superuser?: boolean
          last_login?: string | null
          last_name?: string | null
          name: string
          password: string
          phone?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          date_joined?: string
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          is_staff?: boolean
          is_superuser?: boolean
          last_login?: string | null
          last_name?: string | null
          name?: string
          password?: string
          phone?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      accounts_userdisguisesettings: {
        Row: {
          created_at: string
          disguise_password: string | null
          fake_app_name: string | null
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          disguise_password?: string | null
          fake_app_name?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          disguise_password?: string | null
          fake_app_name?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_userdisguisesettings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "accounts_user"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts_userfeedback: {
        Row: {
          content: string
          created_at: string
          feedback_type: string | null
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          feedback_type?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          feedback_type?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_userfeedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "accounts_user"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts_userprofile: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_userprofile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "accounts_user"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts_emergencycontact: {
        Row: {
          created_at: string
          id: string
          name: string
          relationship: string | null
          telegram_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          relationship?: string | null
          telegram_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          relationship?: string | null
          telegram_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_emergencycontact_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "accounts_user"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts_safecontact: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          relationship: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          relationship?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          relationship?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_safecontact_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "accounts_user"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_diaryattachment: {
        Row: {
          created_at: string
          entry_id: string
          file: string
          file_type: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          file: string
          file_type?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          file?: string
          file_type?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_diaryattachment_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "diary_diaryentry"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_diaryentry: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          date: string
          id: string
          location: string | null
          mood: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          date?: string
          id?: string
          location?: string | null
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          date?: string
          id?: string
          location?: string | null
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_diaryentry_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "accounts_user"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_entries: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          date: string
          id: string
          location: string | null
          mood: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          date?: string
          id?: string
          location?: string | null
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          date?: string
          id?: string
          location?: string | null
          mood?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          name: string
          relationship: string | null
          telegram_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          relationship?: string | null
          telegram_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          relationship?: string | null
          telegram_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emergency_emergencyalert: {
        Row: {
          contacts_notified: Json | null
          created_at: string
          id: string
          location: string | null
          message: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contacts_notified?: Json | null
          created_at?: string
          id?: string
          location?: string | null
          message?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contacts_notified?: Json | null
          created_at?: string
          id?: string
          location?: string | null
          message?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_emergencyalert_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "accounts_user"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      safe_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          relationship: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          relationship?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          relationship?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_disguise_settings: {
        Row: {
          created_at: string
          disguise_password: string | null
          fake_app_name: string | null
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          disguise_password?: string | null
          fake_app_name?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          disguise_password?: string | null
          fake_app_name?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          content: string
          created_at: string
          feedback_type: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          feedback_type?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          feedback_type?: string
          id?: string
          updated_at?: string
          user_id?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
