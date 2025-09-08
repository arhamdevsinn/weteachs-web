export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface UserProfileData {
  // Basic info
  uid: string;
  display_name: string;
  email: string;
  photo_url: string;
   // Timestamps (converted from Firebase format)
  Birthday?: Date;
  created_time?: Date;
  
  // String fields
  Howd_you_here_of_us?: string;
  
  // Boolean fields
  Popup?: boolean;
  Pre_testers?: boolean;
  bio_set?: boolean;
  buttery?: boolean;
  isTeacher?: boolean;
  signupcomplete?: boolean;
  signupcompletepage2?: boolean;
  
  // References (will need to be resolved)
  teacher_ref?: string; // Path to teacher document
  user_call_manage?: string; // Path to call management document
  
  // Additional fields that might exist
  [key: string]: unknown;   // 🔥 safer than `any`
}

export interface TeacherDetails {
  id: string;
  // Add teacher-specific fields here
  qualifications?: string[];
  subjects?: string[];
  experience?: number;
  Number_of_completed_jobs?: [string];
  rating?: number;
  bio_T?: string;
  hourly_rate?: number;
  Total_amount_earned?: [string];
  availability?: string[];
  // ... other teacher fields
}

export interface UserCallManagement {
  id: string;
  // Add call management fields here
  current_calls?: number;
  max_calls?: number;
  call_history?: Record<string, unknown>[];   // 🔥 structured instead of `any[]`
  // ... other call management fields
}
