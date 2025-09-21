export interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  skills_text?: string;
  degree?: string;
  stream?: string;
  city?: string;
  state?: string;
  pincode?: string;
  caste?: string;
  gender?: string;
  financial_status?: string;
  preferred_locations?: string;
  other_notes?: string;
  created_at: string;
}

export interface Company {
  company_id: number;
  company_name: string;
  position_title?: string;
  req_skills_text?: string;
  job_description?: string;
  location_city?: string;
  location_state?: string;
  stipend?: number;
  openings: number;
  priority_flags?: string;
  other_notes?: string;
  created_at: string;
}

export interface AllocationResult {
  student_id: number;
  student_name: string;
  company_id: number;
  company_name: string;
  score: number;
}

export interface AllocationResponse {
  allocations: AllocationResult[];
  unallocated_students?: { student_id: number; student_name: string }[];
  unallocated_count?: number;
  total_students: number;
  total_companies: number;
  processing_time: number;
}

export interface UploadResponse {
  accepted: number;
  rejected: number;
  errors: string[];
}

export interface CSVUploadResponse {
  message: string;
  accepted: number;
  rejected: number;
  errors: string[];
}
