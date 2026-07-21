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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounting_settings: {
        Row: {
          address: string
          bank_details: string
          company_name: string
          default_credit_days: number
          default_tax_rate: number
          email: string
          id: number
          invoice_next_seq: number
          invoice_prefix: string
          ntn: string
          phone: string
          quotation_next_seq: number
          quotation_prefix: string
          quotation_terms: string
          strn: string
          updated_at: string
          website: string
        }
        Insert: {
          address?: string
          bank_details?: string
          company_name?: string
          default_credit_days?: number
          default_tax_rate?: number
          email?: string
          id?: number
          invoice_next_seq?: number
          invoice_prefix?: string
          ntn?: string
          phone?: string
          quotation_next_seq?: number
          quotation_prefix?: string
          quotation_terms?: string
          strn?: string
          updated_at?: string
          website?: string
        }
        Update: {
          address?: string
          bank_details?: string
          company_name?: string
          default_credit_days?: number
          default_tax_rate?: number
          email?: string
          id?: number
          invoice_next_seq?: number
          invoice_prefix?: string
          ntn?: string
          phone?: string
          quotation_next_seq?: number
          quotation_prefix?: string
          quotation_terms?: string
          strn?: string
          updated_at?: string
          website?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string
          city: string
          company: string
          country: string
          created_at: string
          email: string
          id: string
          name: string
          notes: string
          ntn: string
          phone: string
          strn: string
          updated_at: string
        }
        Insert: {
          address?: string
          city?: string
          company?: string
          country?: string
          created_at?: string
          email?: string
          id?: string
          name: string
          notes?: string
          ntn?: string
          phone?: string
          strn?: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          company?: string
          country?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string
          ntn?: string
          phone?: string
          strn?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          description: string
          detail: string
          id: string
          invoice_id: string
          quantity: number
          sort_order: number
          unit_price: number
        }
        Insert: {
          amount?: number
          description?: string
          detail?: string
          id?: string
          invoice_id: string
          quantity?: number
          sort_order?: number
          unit_price?: number
        }
        Update: {
          amount?: number
          description?: string
          detail?: string
          id?: string
          invoice_id?: string
          quantity?: number
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance: number
          created_at: string
          currency: string
          customer_id: string | null
          customer_snapshot: Json
          date: string
          due_date: string | null
          id: string
          notes: string
          number: string
          paid_amount: number
          po_date: string | null
          po_number: string
          quotation_id: string | null
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          terms: string
          total: number
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_snapshot?: Json
          date?: string
          due_date?: string | null
          id?: string
          notes?: string
          number: string
          paid_amount?: number
          po_date?: string | null
          po_number?: string
          quotation_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          terms?: string
          total?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_snapshot?: Json
          date?: string
          due_date?: string | null
          id?: string
          notes?: string
          number?: string
          paid_amount?: number
          po_date?: string | null
          po_number?: string
          quotation_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          terms?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          product: string
          qty: string | null
          req_type: string
          source: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone: string
          product: string
          qty?: string | null
          req_type: string
          source?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          product?: string
          qty?: string | null
          req_type?: string
          source?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          bank_name: string
          created_at: string
          customer_id: string | null
          date: string
          id: string
          invoice_id: string | null
          method: string
          notes: string
          reference_no: string
        }
        Insert: {
          amount?: number
          bank_name?: string
          created_at?: string
          customer_id?: string | null
          date?: string
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string
          reference_no?: string
        }
        Update: {
          amount?: number
          bank_name?: string
          created_at?: string
          customer_id?: string | null
          date?: string
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string
          reference_no?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          brands: Json
          created_at: string
          icon: string
          image_url: string | null
          intro: string
          name: string
          short_name: string
          slug: string
          sort_order: number
          tagline: string
          updated_at: string
          use_cases: Json
        }
        Insert: {
          brands?: Json
          created_at?: string
          icon?: string
          image_url?: string | null
          intro?: string
          name: string
          short_name: string
          slug: string
          sort_order?: number
          tagline?: string
          updated_at?: string
          use_cases?: Json
        }
        Update: {
          brands?: Json
          created_at?: string
          icon?: string
          image_url?: string | null
          intro?: string
          name?: string
          short_name?: string
          slug?: string
          sort_order?: number
          tagline?: string
          updated_at?: string
          use_cases?: Json
        }
        Relationships: []
      }
      products: {
        Row: {
          billing_period: string | null
          brand: string
          category_slug: string
          created_at: string
          description: string
          featured: boolean
          highlight: string
          id: string
          image_url: string | null
          in_stock: boolean
          max_months: number | null
          min_months: number | null
          name: string
          price: string | null
          price_note: string | null
          sort_order: number
          specs: Json
          stock: number
          updated_at: string
        }
        Insert: {
          billing_period?: string | null
          brand?: string
          category_slug: string
          created_at?: string
          description?: string
          featured?: boolean
          highlight?: string
          id?: string
          image_url?: string | null
          in_stock?: boolean
          max_months?: number | null
          min_months?: number | null
          name: string
          price?: string | null
          price_note?: string | null
          sort_order?: number
          specs?: Json
          stock?: number
          updated_at?: string
        }
        Update: {
          billing_period?: string | null
          brand?: string
          category_slug?: string
          created_at?: string
          description?: string
          featured?: boolean
          highlight?: string
          id?: string
          image_url?: string | null
          in_stock?: boolean
          max_months?: number | null
          min_months?: number | null
          name?: string
          price?: string | null
          price_note?: string | null
          sort_order?: number
          specs?: Json
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      quotation_items: {
        Row: {
          amount: number
          description: string
          detail: string
          id: string
          quantity: number
          quotation_id: string
          sort_order: number
          unit_price: number
        }
        Insert: {
          amount?: number
          description?: string
          detail?: string
          id?: string
          quantity?: number
          quotation_id: string
          sort_order?: number
          unit_price?: number
        }
        Update: {
          amount?: number
          description?: string
          detail?: string
          id?: string
          quantity?: number
          quotation_id?: string
          sort_order?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          created_at: string
          currency: string
          customer_id: string | null
          customer_snapshot: Json
          date: string
          id: string
          notes: string
          number: string
          status: string
          subtotal: number
          tax_amount: number
          tax_rate: number
          terms: string
          total: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_snapshot?: Json
          date?: string
          id?: string
          notes?: string
          number: string
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          terms?: string
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          customer_id?: string | null
          customer_snapshot?: Json
          date?: string
          id?: string
          notes?: string
          number?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          terms?: string
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          icon: string
          image_url: string | null
          included: Json
          industries: Json
          intro: string
          name: string
          process: Json
          short_name: string
          slug: string
          sort_order: number
          tagline: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string
          image_url?: string | null
          included?: Json
          industries?: Json
          intro?: string
          name: string
          process?: Json
          short_name: string
          slug: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string
          image_url?: string | null
          included?: Json
          industries?: Json
          intro?: string
          name?: string
          process?: Json
          short_name?: string
          slug?: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplier_bills: {
        Row: {
          balance: number
          created_at: string
          credit_days: number
          date: string
          due_date: string | null
          id: string
          items: Json
          notes: string
          number: string
          paid_amount: number
          related_invoice_id: string | null
          status: string
          subtotal: number
          supplier_id: string | null
          supplier_snapshot: Json
          tax_amount: number
          tax_rate: number
          total: number
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          credit_days?: number
          date?: string
          due_date?: string | null
          id?: string
          items?: Json
          notes?: string
          number: string
          paid_amount?: number
          related_invoice_id?: string | null
          status?: string
          subtotal?: number
          supplier_id?: string | null
          supplier_snapshot?: Json
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          credit_days?: number
          date?: string
          due_date?: string | null
          id?: string
          items?: Json
          notes?: string
          number?: string
          paid_amount?: number
          related_invoice_id?: string | null
          status?: string
          subtotal?: number
          supplier_id?: string | null
          supplier_snapshot?: Json
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_bills_related_invoice_id_fkey"
            columns: ["related_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_bills_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_payments: {
        Row: {
          amount: number
          bank_name: string
          bill_id: string | null
          created_at: string
          date: string
          id: string
          method: string
          notes: string
          reference_no: string
          supplier_id: string | null
        }
        Insert: {
          amount?: number
          bank_name?: string
          bill_id?: string | null
          created_at?: string
          date?: string
          id?: string
          method?: string
          notes?: string
          reference_no?: string
          supplier_id?: string | null
        }
        Update: {
          amount?: number
          bank_name?: string
          bill_id?: string | null
          created_at?: string
          date?: string
          id?: string
          method?: string
          notes?: string
          reference_no?: string
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "supplier_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_payments_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string
          bank_details: string
          city: string
          company: string
          country: string
          created_at: string
          default_credit_days: number
          email: string
          id: string
          name: string
          notes: string
          ntn: string
          phone: string
          strn: string
          updated_at: string
        }
        Insert: {
          address?: string
          bank_details?: string
          city?: string
          company?: string
          country?: string
          created_at?: string
          default_credit_days?: number
          email?: string
          id?: string
          name: string
          notes?: string
          ntn?: string
          phone?: string
          strn?: string
          updated_at?: string
        }
        Update: {
          address?: string
          bank_details?: string
          city?: string
          company?: string
          country?: string
          created_at?: string
          default_credit_days?: number
          email?: string
          id?: string
          name?: string
          notes?: string
          ntn?: string
          phone?: string
          strn?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      next_document_number: { Args: { doc_type: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
