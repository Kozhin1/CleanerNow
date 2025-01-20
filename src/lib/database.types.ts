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
          email: string
          full_name: string | null
          avatar_url: string | null
          phone_number: string | null
          address: string | null
          is_cleaner: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          address?: string | null
          is_cleaner?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          address?: string | null
          is_cleaner?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cleaner_profiles: {
        Row: {
          id: string
          bio: string | null
          hourly_rate: number
          years_experience: number
          service_area: string[]
          services_offered: string[]
          availability: Json
          is_verified: boolean
          verification_documents: Json
          insurance_info: Json
          background_check_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          bio?: string | null
          hourly_rate: number
          years_experience?: number
          service_area?: string[]
          services_offered?: string[]
          availability?: Json
          is_verified?: boolean
          verification_documents?: Json
          insurance_info?: Json
          background_check_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bio?: string | null
          hourly_rate?: number
          years_experience?: number
          service_area?: string[]
          services_offered?: string[]
          availability?: Json
          is_verified?: boolean
          verification_documents?: Json
          insurance_info?: Json
          background_check_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          client_id: string
          cleaner_id: string
          service_date: string
          duration_hours: number
          total_amount: number
          status: string
          service_type: string
          special_instructions: string | null
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          cleaner_id: string
          service_date: string
          duration_hours: number
          total_amount: number
          status?: string
          service_type: string
          special_instructions?: string | null
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          cleaner_id?: string
          service_date?: string
          duration_hours?: number
          total_amount?: number
          status?: string
          service_type?: string
          special_instructions?: string | null
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}