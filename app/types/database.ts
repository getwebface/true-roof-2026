export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      a_b_tests: {
        Row: {
          bounce_rate: number | null
          component_id: string
          conversion_rate: number | null
          created_at: string | null
          end_date: string | null
          hesitation_rate: number | null
          id: string
          page_id: string | null
          scroll_depth: number | null
          start_date: string | null
          status: string | null
          test_group_size: number | null
          time_on_component: number | null
          updated_at: string | null
          variant_json: Json
          variant_name: string
        }
        Insert: {
          bounce_rate?: number | null
          component_id: string
          conversion_rate?: number | null
          created_at?: string | null
          end_date?: string | null
          hesitation_rate?: number | null
          id?: string
          page_id?: string | null
          scroll_depth?: number | null
          start_date?: string | null
          status?: string | null
          test_group_size?: number | null
          time_on_component?: number | null
          updated_at?: string | null
          variant_json: Json
          variant_name: string
        }
        Update: {
          bounce_rate?: number | null
          component_id?: string
          conversion_rate?: number | null
          created_at?: string | null
          end_date?: string | null
          hesitation_rate?: number | null
          id?: string
          page_id?: string | null
          scroll_depth?: number | null
          start_date?: string | null
          status?: string | null
          test_group_size?: number | null
          time_on_component?: number | null
          updated_at?: string | null
          variant_json?: Json
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "a_b_tests_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      application_logs: {
        Row: {
          category: string
          component_id: string | null
          environment: string
          error_stack: string | null
          id: string
          level: string
          message: string
          metadata: Json | null
          page_url: string | null
          session_id: string | null
          timestamp: string
          user_id: string | null
          version: string | null
        }
        Insert: {
          category: string
          component_id?: string | null
          environment: string
          error_stack?: string | null
          id: string
          level: string
          message: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          timestamp?: string
          user_id?: string | null
          version?: string | null
        }
        Update: {
          category?: string
          component_id?: string | null
          environment?: string
          error_stack?: string | null
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          page_url?: string | null
          session_id?: string | null
          timestamp?: string
          user_id?: string | null
          version?: string | null
        }
        Relationships: []
      }
      behavior_events: {
        Row: {
          component_id: string | null
          coordinates: Json | null
          element_path: string | null
          element_text: string | null
          element_type: string | null
          event_data: Json
          event_type: string
          id: string
          metadata: Json | null
          page_url: string
          session_id: string
          timestamp: string | null
          viewport_size: Json | null
        }
        Insert: {
          component_id?: string | null
          coordinates?: Json | null
          element_path?: string | null
          element_text?: string | null
          element_type?: string | null
          event_data?: Json
          event_type: string
          id?: string
          metadata?: Json | null
          page_url: string
          session_id: string
          timestamp?: string | null
          viewport_size?: Json | null
        }
        Update: {
          component_id?: string | null
          coordinates?: Json | null
          element_path?: string | null
          element_text?: string | null
          element_type?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          metadata?: Json | null
          page_url?: string
          session_id?: string
          timestamp?: string | null
          viewport_size?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "behavior_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "session_analytics"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "behavior_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      component_analytics: {
        Row: {
          component_id: string
          component_type: string
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          page_id: string | null
          referrer: string | null
          scroll_position: number | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          viewport_size: Json | null
        }
        Insert: {
          component_id: string
          component_type: string
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          page_id?: string | null
          referrer?: string | null
          scroll_position?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewport_size?: Json | null
        }
        Update: {
          component_id?: string
          component_type?: string
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          page_id?: string | null
          referrer?: string | null
          scroll_position?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          viewport_size?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "component_analytics_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_funnels: {
        Row: {
          dropoff_reason: string | null
          duration_seconds: number | null
          entered_at: string | null
          exited_at: string | null
          funnel_name: string
          id: string
          metadata: Json | null
          session_id: string
          step_name: string
          step_order: number
        }
        Insert: {
          dropoff_reason?: string | null
          duration_seconds?: number | null
          entered_at?: string | null
          exited_at?: string | null
          funnel_name: string
          id?: string
          metadata?: Json | null
          session_id: string
          step_name: string
          step_order: number
        }
        Update: {
          dropoff_reason?: string | null
          duration_seconds?: number | null
          entered_at?: string | null
          exited_at?: string | null
          funnel_name?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          step_name?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "conversion_funnels_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "session_analytics"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "conversion_funnels_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      optimization_logs: {
        Row: {
          action: string
          component_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          page_id: string | null
          variant_count: number | null
        }
        Insert: {
          action: string
          component_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          page_id?: string | null
          variant_count?: number | null
        }
        Update: {
          action?: string
          component_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          page_id?: string | null
          variant_count?: number | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          address: string | null
          before_after_slides: Json | null
          bento_cards: Json | null
          canonical_url: string | null
          company_name: string | null
          component_performance: Json | null
          content_sections: Json | null
          created_at: string | null
          email: string | null
          faq_items: Json | null
          h1_heading: string | null
          h2_heading: string | null
          id: string
          last_optimized_at: string | null
          latitude: number | null
          location_name: string | null
          location_state_region: string | null
          logo_url: string | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          migrated_at: string | null
          optimization_count: number | null
          page_type: string
          phone_number: string | null
          primary_color: string | null
          primary_cta: string | null
          process_steps: Json | null
          secondary_color: string | null
          secondary_cta: string | null
          service_areas: Json | null
          service_highlights: Json | null
          service_radius_km: number | null
          site_id: string | null
          slug: string
          social_proof: Json | null
          stats: Json | null
          status: string | null
          tagline: string | null
          testimonials: Json | null
          trust_badges: Json | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          before_after_slides?: Json | null
          bento_cards?: Json | null
          canonical_url?: string | null
          company_name?: string | null
          component_performance?: Json | null
          content_sections?: Json | null
          created_at?: string | null
          email?: string | null
          faq_items?: Json | null
          h1_heading?: string | null
          h2_heading?: string | null
          id?: string
          last_optimized_at?: string | null
          latitude?: number | null
          location_name?: string | null
          location_state_region?: string | null
          logo_url?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          migrated_at?: string | null
          optimization_count?: number | null
          page_type: string
          phone_number?: string | null
          primary_color?: string | null
          primary_cta?: string | null
          process_steps?: Json | null
          secondary_color?: string | null
          secondary_cta?: string | null
          service_areas?: Json | null
          service_highlights?: Json | null
          service_radius_km?: number | null
          site_id?: string | null
          slug: string
          social_proof?: Json | null
          stats?: Json | null
          status?: string | null
          tagline?: string | null
          testimonials?: Json | null
          trust_badges?: Json | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          before_after_slides?: Json | null
          bento_cards?: Json | null
          canonical_url?: string | null
          company_name?: string | null
          component_performance?: Json | null
          content_sections?: Json | null
          created_at?: string | null
          email?: string | null
          faq_items?: Json | null
          h1_heading?: string | null
          h2_heading?: string | null
          id?: string
          last_optimized_at?: string | null
          latitude?: number | null
          location_name?: string | null
          location_state_region?: string | null
          logo_url?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          migrated_at?: string | null
          optimization_count?: number | null
          page_type?: string
          phone_number?: string | null
          primary_color?: string | null
          primary_cta?: string | null
          process_steps?: Json | null
          secondary_color?: string | null
          secondary_cta?: string | null
          service_areas?: Json | null
          service_highlights?: Json | null
          service_radius_km?: number | null
          site_id?: string | null
          slug?: string
          social_proof?: Json | null
          stats?: Json | null
          status?: string | null
          tagline?: string | null
          testimonials?: Json | null
          trust_badges?: Json | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          created_at: string | null
          domain: string
          email: string | null
          id: string
          is_active: boolean | null
          location: Json | null
          logo_url: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          site_name: string
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          location?: Json | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_name: string
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          location?: Json | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_name?: string
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          country_code: string | null
          created_at: string | null
          device_type: string | null
          duration_seconds: number | null
          exit_page: string | null
          exit_reason: string | null
          id: string
          landing_page: string
          language: string | null
          page_count: number | null
          referrer: string | null
          screen_resolution: string | null
          session_id: string
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          exit_page?: string | null
          exit_reason?: string | null
          id?: string
          landing_page: string
          language?: string | null
          page_count?: number | null
          referrer?: string | null
          screen_resolution?: string | null
          session_id: string
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          exit_page?: string | null
          exit_reason?: string | null
          id?: string
          landing_page?: string
          language?: string | null
          page_count?: number | null
          referrer?: string | null
          screen_resolution?: string | null
          session_id?: string
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      component_performance: {
        Row: {
          avg_hesitation_ms: number | null
          clicks: number | null
          component_id: string | null
          conversions: number | null
          first_seen: string | null
          hesitations: number | null
          last_seen: string | null
          page_url: string | null
          rage_clicks: number | null
          total_interactions: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      daily_friction_summary: {
        Row: {
          avg_hesitation_ms: number | null
          date: string | null
          element_path: string | null
          event_count: number | null
          event_type: string | null
          form_abandons: number | null
          form_submits: number | null
          median_hesitation_ms: number | null
          unique_sessions: number | null
        }
        Relationships: []
      }
      error_summary: {
        Row: {
          affected_components: string[] | null
          affected_sessions: number | null
          affected_users: number | null
          category: string | null
          date: string | null
          environment: string | null
          error_count: number | null
          level: string | null
        }
        Relationships: []
      }
      friction_points: {
        Row: {
          affected_sessions: number | null
          avg_time_to_event: number | null
          element_path: string | null
          element_type: string | null
          event_count: number | null
          event_type: string | null
          first_seen: string | null
          last_seen: string | null
          pages_affected: string[] | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          avg_value: number | null
          category: string | null
          date: string | null
          max_value: number | null
          measurement_count: number | null
          metric_category: string | null
          metric_unit: string | null
          metric_value: string | null
          min_value: number | null
        }
        Relationships: []
      }
      session_analytics: {
        Row: {
          click_count: number | null
          duration_seconds: number | null
          exit_page: string | null
          exit_reason: string | null
          form_abandon_count: number | null
          form_submit_count: number | null
          funnels_entered: string[] | null
          hesitation_count: number | null
          landing_page: string | null
          max_scroll_depth: number | null
          page_count: number | null
          rage_click_count: number | null
          session_id: string | null
          total_events: number | null
        }
        Relationships: []
      }
      user_activity_summary: {
        Row: {
          component_renders: number | null
          date: string | null
          errors: number | null
          pages_visited: string[] | null
          session_end: string | null
          session_id: string | null
          session_start: string | null
          total_actions: number | null
          user_actions: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_old_logs: { Args: never; Returns: number }
      cleanup_old_logs_production: { Args: never; Returns: number }
      get_component_error_rate: {
        Args: { component_id_param: string; days_back?: number }
        Returns: {
          component_id: string
          error_count: number
          error_rate: number
          total_logs: number
        }[]
      }
      get_session_error_summary: {
        Args: { session_id_param: string }
        Returns: {
          error_categories: string[]
          error_logs: number
          first_error: string
          last_error: string
          session_id: string
          total_logs: number
        }[]
      }
      migrate_to_modular_schema: { Args: never; Returns: undefined }
      perform_log_maintenance: {
        Args: never
        Returns: {
          development_deleted: number
          production_deleted: number
          total_errors_today: number
          total_warnings_today: number
        }[]
      }
    }
    Enums: {
      page_type_enum: "home" | "service_hub" | "local_service"
      publish_status_enum: "draft" | "published" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      page_type_enum: ["home", "service_hub", "local_service"],
      publish_status_enum: ["draft", "published", "archived"],
    },
  },
} as const
