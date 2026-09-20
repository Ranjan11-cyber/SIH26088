export type SupportedLanguage = 'en' | 'kn' | 'hi' | 'ta' | 'te' | 'ml';

export type UserRole = 'farmer' | 'dairy_artisan' | 'secretary' | 'citizen';

export type Jurisdiction = 'karnataka_state' | 'mscs_central' | 'national_model';

export interface UserProfile {
  id: string;
  name: string;
  phone_or_email: string;
  role: UserRole;
  language: SupportedLanguage;
  jurisdiction: Jurisdiction;
  society_name?: string;
  membership_number?: string;
  district?: string;
  is_verified?: boolean;
  avatar_initials?: string;
  last_login?: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  token?: string;
  user: UserProfile | null;
  loginMethod: 'otp' | 'official_id' | 'member_id' | 'guest';
}

export interface LegalSource {
  title: string;
  act_or_bylaw: string;
  section_or_clause: string;
  page_or_gazette?: string;
  excerpt: string;
  confidence: 'High' | 'Medium' | 'Guideline';
  url?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: LegalSource[];
  evidence_strength?: 'Statutory Law' | 'State Bylaw' | 'Central Guideline' | 'Advisory';
  language?: SupportedLanguage;
  domain?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  language: SupportedLanguage;
  jurisdiction: Jurisdiction;
  created_at: string;
  messages: ChatMessage[];
}

export type GrievanceCategory = 
  | 'membership_denial'
  | 'voting_rights'
  | 'loan_subvention_dispute'
  | 'milk_payment_bonus'
  | 'audit_financial_irregularity'
  | 'election_agm_violation'
  | 'misuse_of_powers';

export type GrievanceStatus = 
  | 'Drafted'
  | 'Submitted to ARCS'
  | 'Under Scrutiny'
  | 'Notice Issued'
  | 'Hearing Scheduled'
  | 'Disposed';

export interface GrievanceHistoryEntry {
  from_status: GrievanceStatus;
  to_status: GrievanceStatus;
  action_by: string;
  remarks: string;
  created_at: string;
}

export interface Grievance {
  id: string;
  reference_number: string;
  applicant_name: string;
  phone_or_email: string;
  district: string;
  taluk: string;
  society_name: string;
  society_reg_number: string;
  category: GrievanceCategory;
  statutory_act: string;
  relevant_section: string;
  facts_summary: string;
  relief_sought: string;
  status: GrievanceStatus;
  is_official_submission: boolean;
  petition_text: string;
  created_at: string;
  updated_at: string;
  history: GrievanceHistoryEntry[];
}

export interface Scheme {
  id: string;
  name: {
    en: string;
    kn: string;
    hi: string;
    ta?: string;
    te?: string;
    ml?: string;
  };
  department: string;
  category: 'credit_interest' | 'solar_equipment' | 'dairy_livestock' | 'digital_infra' | 'health_welfare';
  subsidy_highlight: string;
  eligibility: string[];
  benefits: string[];
  documents_required: string[];
  application_mode: 'Online PACS Portal' | 'District Registrar Office' | 'Direct Benefit Transfer (DBT)';
  official_link?: string;
}

export interface BylawDocument {
  id: string;
  title: string;
  title_kn?: string;
  title_hi?: string;
  title_ta?: string;
  title_te?: string;
  title_ml?: string;
  document_type: 'Act' | 'Model Bylaw' | 'Gazette Circular' | 'NABARD Guideline';
  jurisdiction: Jurisdiction;
  year: number;
  total_sections: number;
  key_highlights: string[];
  summary: string;
  pdf_size?: string;
}

export interface CivicMetric {
  total_registered_grievances: number;
  resolved_percentage: number;
  average_hearing_days: number;
  cooperatives_digitized: number;
  pacs_computerization_count: number;
  vernacular_adoption: {
    kannada_percent: number;
    hindi_percent: number;
    english_percent: number;
    tamil_percent?: number;
    telugu_percent?: number;
    malayalam_percent?: number;
  };
}

export interface CooperativeSocietySummary {
  id: string;
  name: string;
  reg_number: string;
  type: 'PACS' | 'Dairy Producers Co-op' | 'DCCB Branch' | 'Horticulture Co-op' | 'Weavers Co-op';
  district: string;
  taluk: string;
  active_members: number;
  petitions_logged: number;
  resolved_petitions: number;
  resolution_rate_percent: number;
  erp_computerization_status: 'Completed' | 'In Progress' | 'Scheduled';
  audit_grade: 'A' | 'B' | 'C';
  kcc_credit_disbursed_lakhs: number;
}
