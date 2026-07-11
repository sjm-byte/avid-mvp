export type UserRole = "investor" | "admin" | "finance_manager";

export type ProjectStatus =
  | "draft"
  | "under_review"
  | "open_for_interest"
  | "funding_in_progress"
  | "funding_completed"
  | "in_execution"
  | "delayed"
  | "settlement_in_progress"
  | "closed_success"
  | "closed_loss"
  | "cancelled";

export type InvestmentRequestStatus =
  | "draft"
  | "risk_accepted"
  | "submitted"
  | "under_review"
  | "approved_pending_payment"
  | "approved_by_admin"
  | "payment_instructions_sent"
  | "receipt_uploaded"
  | "payment_verified"
  | "allocated_to_project"
  | "rejected"
  | "cancelled"
  | "cancelled_by_investor";

export type LedgerEntryType =
  | "investment_commitment"
  | "payment_receipt_uploaded"
  | "payment_verified"
  | "capital_allocated"
  | "project_cost_recorded"
  | "project_revenue_recorded"
  | "initial_fee_recorded"
  | "success_fee_recorded"
  | "profit_calculated"
  | "loss_calculated"
  | "settlement_due"
  | "settlement_paid"
  | "settlement_result"
  | "adjustment";

export type DocumentVisibility = "public" | "investors_only" | "admin_only";

export type DocumentType =
  | "contract"
  | "invoice"
  | "report"
  | "image"
  | "video"
  | "audit"
  | "other";

export type MilestoneStatus =
  | "planned"
  | "in_progress"
  | "done"
  | "delayed"
  | "cancelled";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          email: string | null;
          role: UserRole;
          national_id: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          role?: UserRole;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      projects: {
        Row: {
          id: string;
          capital_seeker_id: string | null;
          title: string;
          slug: string;
          short_description: string | null;
          full_description: string | null;
          category: string | null;
          project_type: string | null;
          status: ProjectStatus;
          min_raise: number;
          max_raise: number;
          min_investment: number;
          expected_duration_days: number | null;
          expected_return_min: number | null;
          expected_return_base: number | null;
          expected_return_max: number | null;
          risk_summary: string | null;
          risk_details: string | null;
          mitigation_plan: string | null;
          payment_instructions: string | null;
          destination_account_owner: string | null;
          destination_iban: string | null;
          destination_bank_name: string | null;
          starts_at: string | null;
          expected_ends_at: string | null;
          actual_ends_at: string | null;
          is_public: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]> & {
          title: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
      };
      project_milestones: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          planned_date: string | null;
          actual_date: string | null;
          status: MilestoneStatus;
          sort_order: number;
          created_at: string;
        };
      };
      project_risk_items: {
        Row: {
          id: string;
          project_id: string;
          risk_type: string;
          description: string;
          mitigation: string | null;
          sort_order: number;
          created_at: string;
        };
      };
      project_documents: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          document_type: DocumentType;
          file_path: string;
          visibility: DocumentVisibility;
          uploaded_by: string | null;
          created_at: string;
        };
      };
      project_funding_summary: {
        Row: {
          project_id: string;
          title: string;
          slug: string;
          status: ProjectStatus;
          min_raise: number;
          max_raise: number;
          total_verified_amount: number;
          investor_count: number;
          funding_percent: number;
        };
      };
      project_financial_results: {
        Row: {
          id: string;
          project_id: string;
          total_verified_capital: number;
          total_revenue: number;
          total_costs: number;
          initial_fee_amount: number;
          success_fee_rate: number;
          success_fee_amount: number;
          net_result_before_success_fee: number;
          distributable_result: number;
          expected_return_base: number | null;
          variance_reason: string | null;
          settlement_date: string | null;
          admin_notes: string | null;
          finalized_by: string | null;
          finalized_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      investments: {
        Row: {
          id: string;
          project_id: string;
          investor_id: string;
          investment_request_id: string | null;
          verified_amount: number;
          ownership_percent: number | null;
          status: "active" | "settlement_pending" | "settled" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          investor_id: string;
          investment_request_id?: string | null;
          verified_amount: number;
          ownership_percent?: number | null;
          status?: "active" | "settlement_pending" | "settled" | "cancelled";
        };
        Update: Partial<Database["public"]["Tables"]["investments"]["Insert"]>;
      };
      ledger_entries: {
        Row: {
          id: string;
          project_id: string | null;
          investor_id: string | null;
          investment_id: string | null;
          entry_type: LedgerEntryType;
          direction: "debit" | "credit" | "memo";
          amount: number;
          currency: string;
          description: string | null;
          reference_type: string | null;
          reference_id: string | null;
          status: "draft" | "posted" | "voided";
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          project_id?: string | null;
          investor_id?: string | null;
          investment_id?: string | null;
          entry_type: LedgerEntryType;
          direction: "debit" | "credit" | "memo";
          amount: number;
          description?: string | null;
          reference_type?: string | null;
          reference_id?: string | null;
          status?: "draft" | "posted" | "voided";
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["ledger_entries"]["Insert"]>;
      };
      payment_receipts: {
        Row: {
          id: string;
          investment_request_id: string;
          project_id: string;
          investor_id: string;
          amount: number;
          paid_at: string | null;
          source_account_info: string | null;
          destination_account_owner: string | null;
          destination_iban: string | null;
          tracking_number: string | null;
          file_path: string | null;
          status: "pending" | "verified" | "rejected";
          verified_by: string | null;
          verified_at: string | null;
          rejection_reason: string | null;
          created_at: string;
        };
        Insert: {
          investment_request_id: string;
          project_id: string;
          investor_id: string;
          amount: number;
          paid_at?: string | null;
          source_account_info?: string | null;
          tracking_number?: string | null;
          file_path?: string | null;
          status?: "pending" | "verified" | "rejected";
        };
        Update: Partial<Database["public"]["Tables"]["payment_receipts"]["Insert"]>;
      };
    };
    Views: {
      project_funding_summary: Database["public"]["Tables"]["project_funding_summary"];
      investor_portfolio_summary: {
        Row: {
          investor_id: string;
          project_count: number;
          total_invested: number;
          realized_profit_or_loss: number;
          total_due: number;
          total_paid: number;
        };
      };
    };
  };
}

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectFundingSummaryRow =
  Database["public"]["Tables"]["project_funding_summary"]["Row"];
export type ProjectMilestoneRow =
  Database["public"]["Tables"]["project_milestones"]["Row"];
export type ProjectRiskItemRow =
  Database["public"]["Tables"]["project_risk_items"]["Row"];
export type ProjectDocumentRow =
  Database["public"]["Tables"]["project_documents"]["Row"];
export type ProjectFinancialResultRow =
  Database["public"]["Tables"]["project_financial_results"]["Row"];
export type PaymentReceiptRow =
  Database["public"]["Tables"]["payment_receipts"]["Row"];
