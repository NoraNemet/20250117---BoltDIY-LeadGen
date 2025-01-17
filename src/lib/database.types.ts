export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: string
          created_at: string
          updated_at: string
          department: string | null
          photo_url: string | null
          phone: string | null
          two_factor_enabled: boolean
        }
        Insert: {
          id: string
          name: string
          role?: string
          created_at?: string
          updated_at?: string
          department?: string | null
          photo_url?: string | null
          phone?: string | null
          two_factor_enabled?: boolean
        }
        Update: {
          id?: string
          name?: string
          role?: string
          created_at?: string
          updated_at?: string
          department?: string | null
          photo_url?: string | null
          phone?: string | null
          two_factor_enabled?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          status: string
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan?: string
          status?: string
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          status?: string
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}