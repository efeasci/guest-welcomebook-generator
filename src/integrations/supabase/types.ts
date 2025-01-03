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
      check_in_photos: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          listing_id: string
          photo_url: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order: number
          id?: string
          listing_id: string
          photo_url: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          listing_id?: string
          photo_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_in_photos_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_recommendations: {
        Row: {
          address: string
          category: string
          created_at: string
          description: string
          id: string
          is_generated: boolean | null
          listing_id: string | null
          location: Json
          name: string
          photo: string | null
        }
        Insert: {
          address: string
          category: string
          created_at?: string
          description: string
          id?: string
          is_generated?: boolean | null
          listing_id?: string | null
          location: Json
          name: string
          photo?: string | null
        }
        Update: {
          address?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_generated?: boolean | null
          listing_id?: string | null
          location?: Json
          name?: string
          photo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_recommendations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address: string
          airbnb_link: string | null
          before_you_leave: string[] | null
          check_in: string
          check_in_instructions: string | null
          check_in_method: string | null
          check_out: string
          created_at: string | null
          directions: string | null
          host_about: string | null
          host_email: string | null
          host_name: string | null
          host_phone: string | null
          house_rules: string[] | null
          id: string
          image_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          wifi_network: string | null
          wifi_password: string | null
        }
        Insert: {
          address: string
          airbnb_link?: string | null
          before_you_leave?: string[] | null
          check_in: string
          check_in_instructions?: string | null
          check_in_method?: string | null
          check_out: string
          created_at?: string | null
          directions?: string | null
          host_about?: string | null
          host_email?: string | null
          host_name?: string | null
          host_phone?: string | null
          house_rules?: string[] | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          wifi_network?: string | null
          wifi_password?: string | null
        }
        Update: {
          address?: string
          airbnb_link?: string | null
          before_you_leave?: string[] | null
          check_in?: string
          check_in_instructions?: string | null
          check_in_method?: string | null
          check_out?: string
          created_at?: string | null
          directions?: string | null
          host_about?: string | null
          host_email?: string | null
          host_name?: string | null
          host_phone?: string | null
          house_rules?: string[] | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          wifi_network?: string | null
          wifi_password?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
