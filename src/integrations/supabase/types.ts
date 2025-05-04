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
      diary_entries: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          location: string | null
          text: string
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          location?: string | null
          text: string
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          location?: string | null
          text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          content: string
          created_at: string
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          id: number
          image: string
          name: string
          price: number
        }
        Insert: {
          category: string
          id?: number
          image: string
          name: string
          price: number
        }
        Update: {
          category?: string
          id?: number
          image?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      safe_contacts: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          relationship: string | null
          telegramid: string | null
          twilioaccountsid: string | null
          twilioauthtoken: string | null
          twiliowhatsappnumber: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          relationship?: string | null
          telegramid?: string | null
          twilioaccountsid?: string | null
          twilioauthtoken?: string | null
          twiliowhatsappnumber?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          relationship?: string | null
          telegramid?: string | null
          twilioaccountsid?: string | null
          twilioauthtoken?: string | null
          twiliowhatsappnumber?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_table_exists: {
        Args: { p_table_name: string }
        Returns: boolean
      }
      count_products: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_products_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_product: {
        Args: { p_id: number }
        Returns: boolean
      }
      exec_sql: {
        Args: { sql: string }
        Returns: undefined
      }
      get_all_products: {
        Args: Record<PropertyKey, never>
        Returns: Record<string, unknown>[]
      }
      insert_product: {
        Args: {
          p_name: string
          p_price: number
          p_category: string
          p_image: string
        }
        Returns: Json
      }
      update_product: {
        Args: {
          p_id: number
          p_name: string
          p_price: number
          p_category: string
          p_image: string
        }
        Returns: Json
      }
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
