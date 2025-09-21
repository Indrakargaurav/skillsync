export const API_ENDPOINTS = {
  STUDENTS: '/students',
  COMPANIES: '/companies',
  UPLOAD_STUDENTS: '/upload/students',
  UPLOAD_COMPANIES: '/upload/companies',
  ALLOCATE: '/allocate',
  ALLOCATIONS: '/allocations',
  EXPORT_ALLOCATIONS: '/export/allocations',
  HEALTH: '/health',
} as const;

export const SCORE_THRESHOLDS = {
  EXCELLENT: 0.8,
  GOOD: 0.6,
  FAIR: 0.4,
} as const;

export const SCORE_LABELS = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
} as const;

export const SCORE_COLORS = {
  EXCELLENT: 'text-green-600 bg-green-100',
  GOOD: 'text-yellow-600 bg-yellow-100',
  FAIR: 'text-orange-600 bg-orange-100',
  POOR: 'text-red-600 bg-red-100',
} as const;

export const CSV_COLUMNS = {
  STUDENTS: [
    'student_id',
    'first_name',
    'last_name',
    'skills_text',
    'degree',
    'stream',
    'city',
    'state',
    'pincode',
    'caste',
    'gender',
    'financial_status',
    'preferred_locations',
    'other_notes',
  ],
  COMPANIES: [
    'company_id',
    'company_name',
    'position_title',
    'req_skills_text',
    'job_description',
    'location_city',
    'location_state',
    'stipend',
    'openings',
    'priority_flags',
    'other_notes',
  ],
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
} as const;
