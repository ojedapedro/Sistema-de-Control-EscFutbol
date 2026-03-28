import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-34a21b05`;

// Auth functions
export const signUp = async (email: string, password: string, name: string, role: string) => {
  const response = await fetch(`${serverUrl}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, password, name, role }),
  });
  return response.json();
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  
  const response = await fetch(`${serverUrl}/me`, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });
  
  if (!response.ok) return null;
  const { user } = await response.json();
  return { ...user, access_token: session.access_token };
};

// Student functions
export const getStudents = async (accessToken: string) => {
  const response = await fetch(`${serverUrl}/students`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error('Error fetching students');
  return response.json();
};

export const getStudent = async (accessToken: string, id: string) => {
  const response = await fetch(`${serverUrl}/students/${id}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error('Error fetching student');
  return response.json();
};

export const createStudent = async (accessToken: string, student: any) => {
  const response = await fetch(`${serverUrl}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(student),
  });
  if (!response.ok) throw new Error('Error creating student');
  return response.json();
};

export const updateStudent = async (accessToken: string, id: string, updates: any) => {
  const response = await fetch(`${serverUrl}/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Error updating student');
  return response.json();
};

export const deleteStudent = async (accessToken: string, id: string) => {
  const response = await fetch(`${serverUrl}/students/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error('Error deleting student');
  return response.json();
};

// Attendance functions
export const recordAttendance = async (accessToken: string, studentId: string) => {
  const response = await fetch(`${serverUrl}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ studentId }),
  });
  
  const data = await response.json();
  return { ...data, ok: response.ok };
};

export const getAttendance = async (accessToken: string, date: string) => {
  const response = await fetch(`${serverUrl}/attendance/${date}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error('Error fetching attendance');
  return response.json();
};

export const getAttendanceStats = async (accessToken: string, date: string) => {
  const response = await fetch(`${serverUrl}/attendance/stats/${date}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error('Error fetching attendance stats');
  return response.json();
};
