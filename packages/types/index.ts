// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Job application types
export type JobStatus = 
  | "wishlist"
  | "applied" 
  | "interview" 
  | "offer" 
  | "rejected";

export interface Job {
  _id: string;
  userId: string;
  company: string;
  role: string;
  status: JobStatus;
  jobDescription?: string;
  notes?: string;
  appliedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}