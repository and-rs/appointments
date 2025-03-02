export interface User {
  id: string; // UUID
  email: string;
  password: string;
  name: string;
  created_at: string;
}

export interface Doctor {
  id: string; // UUID
  name: string;
  specialty: string;
  created_at: string;
}

export interface Appointment {
  id: string; // UUID
  user_id: string; // UUID (references User)
  doctor_id: string; // UUID (references Doctor)
  date: string; // DATE (ISO 8601 date string, e.g., '2025-03-02')
  time: string; // TIME (Time string, e.g., '14:30:00')
  created_at: string; // TIMESTAMPTZ (ISO 8601 date-time string)
}
