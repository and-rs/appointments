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
  id?: string;
  user_id?: string;
  doctor_id: string;
  date: string;
  time: string;
  created_at?: string;
}

export interface AuthResponse {
  result: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}
