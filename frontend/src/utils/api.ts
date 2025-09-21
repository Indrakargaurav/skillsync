const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }
  
  return response.json();
}

export const api = {
  // Students
  async getStudents(skip = 0, limit = 100) {
    const response = await fetch(`${API_BASE_URL}/students?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  async getStudent(id: number) {
    const response = await fetch(`${API_BASE_URL}/students/${id}`);
    return handleResponse(response);
  },

  async createStudent(data: any) {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Companies
  async getCompanies(skip = 0, limit = 100) {
    const response = await fetch(`${API_BASE_URL}/companies?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },

  async getCompany(id: number) {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`);
    return handleResponse(response);
  },

  async createCompany(data: any) {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Upload
  async uploadStudents(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/students`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  async uploadCompanies(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/companies`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  // Allocations
  async runAllocation() {
    const response = await fetch(`${API_BASE_URL}/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  async getAllocations() {
    const response = await fetch(`${API_BASE_URL}/allocations`);
    return handleResponse(response);
  },

  async exportAllocations() {
    const response = await fetch(`${API_BASE_URL}/export/allocations`);
    if (!response.ok) {
      throw new ApiError('Failed to export allocations', response.status);
    }
    return response.blob();
  },

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },
};
