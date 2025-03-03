export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  date: string;
  time: string;
  created_at: string;
}

// types for later on:
// ids = uuid
// DATE (ISO 8601 '2025-03-02')
// TIME (Time string '14:30:00')
// TIMESTAMPTZ (ISO 8601) for created_at
