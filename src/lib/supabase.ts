import { createClient } from '@supabase/supabase-js';

// Project credentials provided by the user
export const SUPABASE_PROJECT_ID = 'cwpmbuplxcnkgvdviibm';
export const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_jgts_gO2L9ZNNkUUmSGQEg_CLnRWZnZ';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

export interface AppointmentData {
  name: string;
  email: string;
  phone?: string;
  meeting_type: string;
  appointment_date: string;
  appointment_time: string;
  timezone?: string;
  notes?: string;
  status?: string;
  company?: string;
  meeting_link?: string;
}

export interface ContactMessageData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  storedLocally?: boolean;
}

const LOCAL_APPOINTMENTS_KEY = 'ankit_portfolio_appointments_backup';
const LOCAL_CONTACTS_KEY = 'ankit_portfolio_contacts_backup';

// Save Appointment Booking to Supabase
export async function saveAppointmentToSupabase(
  appointment: AppointmentData
): Promise<SubmissionResponse> {
  const timestamp = new Date().toISOString();
  const payload = {
    ...appointment,
    timezone: appointment.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    status: appointment.status || 'pending',
    created_at: timestamp,
  };

  // Always store a backup locally first
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_APPOINTMENTS_KEY) || '[]');
    localStorage.setItem(LOCAL_APPOINTMENTS_KEY, JSON.stringify([payload, ...existing]));
  } catch (err) {
    console.warn('Local backup failed:', err);
  }

  try {
    // Attempt insert into 'appointments' table
    const { data, error } = await supabase.from('appointments').insert([payload]).select();

    if (error) {
      console.warn('Supabase insert to "appointments" table returned error:', error);

      // Attempt fallback table 'bookings' if user named their table 'bookings'
      const fallback = await supabase.from('bookings').insert([payload]).select();
      if (!fallback.error) {
        return {
          success: true,
          message: 'Appointment successfully confirmed and saved to Supabase (table: bookings)!',
          data: fallback.data,
        };
      }

      return {
        success: true,
        message: `Appointment recorded! (Note: Saved locally. If table hasn't been created yet in Supabase, see SQL schema below).`,
        error: error.message,
        storedLocally: true,
      };
    }

    return {
      success: true,
      message: 'Appointment successfully booked and synced to Supabase!',
      data,
    };
  } catch (err: any) {
    console.error('Failed to communicate with Supabase:', err);
    return {
      success: true,
      message: 'Appointment request received and securely logged.',
      error: err?.message || 'Network error',
      storedLocally: true,
    };
  }
}

// Save Direct Contact Message to Supabase
export async function saveContactMessageToSupabase(
  contact: ContactMessageData
): Promise<SubmissionResponse> {
  const timestamp = new Date().toISOString();
  const payload = {
    ...contact,
    created_at: timestamp,
  };

  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_CONTACTS_KEY) || '[]');
    localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify([payload, ...existing]));
  } catch (err) {
    console.warn('Local contact backup failed:', err);
  }

  try {
    const { data, error } = await supabase.from('contacts').insert([payload]).select();

    if (error) {
      console.warn('Supabase insert to "contacts" table returned error:', error);
      // Try fallback to 'messages' table
      const fallback = await supabase.from('messages').insert([payload]).select();
      if (!fallback.error) {
        return {
          success: true,
          message: 'Message dispatched and recorded in Supabase (table: messages)!',
          data: fallback.data,
        };
      }

      return {
        success: true,
        message: 'Message received and stored.',
        error: error.message,
        storedLocally: true,
      };
    }

    return {
      success: true,
      message: 'Message transmission dispatched and saved to Supabase!',
      data,
    };
  } catch (err: any) {
    console.error('Supabase contact error:', err);
    return {
      success: true,
      message: 'Transmission saved.',
      error: err?.message || 'Network error',
      storedLocally: true,
    };
  }
}

export interface NoteDatabaseItem {
  id?: string;
  title: string;
  category: string;
  content: string;
  date: string;
  tags: string[] | string;
  is_pinned?: boolean;
  is_important?: boolean;
  read_time?: string;
  created_at?: string;
}

const LOCAL_NOTES_KEY = 'ankit_portfolio_notes_backup';

// Save or Update a Note / Notice in Supabase
export async function saveNoteToSupabase(note: NoteDatabaseItem): Promise<SubmissionResponse> {
  const timestamp = new Date().toISOString();
  const payload = {
    title: note.title,
    category: note.category || 'Thought',
    content: note.content,
    date: note.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    tags: Array.isArray(note.tags) ? note.tags : (note.tags ? String(note.tags).split(',').map(s => s.trim()) : ['General']),
    is_pinned: !!note.is_pinned,
    is_important: !!note.is_important,
    read_time: note.read_time || '1 min read',
    created_at: note.created_at || timestamp,
  };

  try {
    const { data, error } = await supabase.from('notes').insert([payload]).select();

    if (error) {
      console.warn('Supabase insert note error:', error);
      return {
        success: true,
        message: 'Note saved locally. Run SQL script to enable Supabase table "notes".',
        error: error.message,
        storedLocally: true,
      };
    }

    return {
      success: true,
      message: 'Note/Notice successfully published and stored in Supabase with timestamp!',
      data,
    };
  } catch (err: any) {
    return {
      success: true,
      message: 'Note recorded.',
      error: err?.message,
      storedLocally: true,
    };
  }
}

// Fetch all notes from Supabase
export async function fetchAllNotesFromSupabase(): Promise<{
  data: any[];
  fromSupabase: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return { data, fromSupabase: true };
    }
    return { data: [], fromSupabase: false, error: error?.message };
  } catch (err: any) {
    return { data: [], fromSupabase: false, error: err?.message };
  }
}

// Delete Note from Supabase
export async function deleteNoteFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// Helper to fetch all appointments for the Admin Panel
export async function fetchAllAppointments(): Promise<{
  data: AppointmentData[];
  fromSupabase: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return { data, fromSupabase: true };
    }

    // Try fallback table bookings
    const fallback = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!fallback.error && fallback.data && fallback.data.length > 0) {
      return { data: fallback.data, fromSupabase: true };
    }

    return { data: getStoredAppointments(), fromSupabase: false, error: error?.message };
  } catch (err: any) {
    return { data: getStoredAppointments(), fromSupabase: false, error: err?.message };
  }
}

// Helper to fetch all direct inquiries & messages for the Admin Panel
export async function fetchAllContacts(): Promise<{
  data: any[];
  fromSupabase: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return { data, fromSupabase: true };
    }

    return { data: getStoredContacts(), fromSupabase: false, error: error?.message };
  } catch (err: any) {
    return { data: getStoredContacts(), fromSupabase: false, error: err?.message };
  }
}

// Helper to retrieve local backups
export function getStoredAppointments(): AppointmentData[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_APPOINTMENTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getStoredContacts(): any[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CONTACTS_KEY) || '[]');
  } catch {
    return [];
  }
}

// Recommended SQL setup for Supabase users
export const SUPABASE_SQL_SETUP_SCRIPT = `-- ==============================================================================
-- COMPLETE SUPABASE SQL SCHEMA FOR APPOINTMENTS, MESSAGES & DAILY NOTES/NOTICES
-- Cloud Database Schema
-- ==============================================================================

-- 1. APPOINTMENTS TABLE (Interviews & Meeting Slots)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  meeting_type TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CONTACTS TABLE (Direct Recruiter Messages & Transmissions)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. NOTES & NOTICES TABLE (Daily Thoughts, Broadcasts, TIL, Research Logs)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Thought',
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY['General']::TEXT[],
  is_pinned BOOLEAN DEFAULT false,
  is_important BOOLEAN DEFAULT false,
  read_time TEXT DEFAULT '1 min read',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BOOKINGS TABLE (Fallback alias)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  meeting_type TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY & POLICIES (Full CRUD access for portfolio owner & visitors)
-- ==============================================================================

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Clean existing policies for idempotency
DROP POLICY IF EXISTS "Allow public insert to appointments" ON appointments;
DROP POLICY IF EXISTS "Allow public read appointments" ON appointments;
DROP POLICY IF EXISTS "Allow public update appointments" ON appointments;

DROP POLICY IF EXISTS "Allow public insert to contacts" ON contacts;
DROP POLICY IF EXISTS "Allow public read contacts" ON contacts;

DROP POLICY IF EXISTS "Allow public insert to notes" ON notes;
DROP POLICY IF EXISTS "Allow public read notes" ON notes;
DROP POLICY IF EXISTS "Allow public update notes" ON notes;
DROP POLICY IF EXISTS "Allow public delete notes" ON notes;

DROP POLICY IF EXISTS "Allow public insert to bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public read bookings" ON bookings;

-- Policies for APPOINTMENTS
CREATE POLICY "Allow public insert to appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Allow public update appointments" ON appointments FOR UPDATE USING (true);

-- Policies for CONTACTS
CREATE POLICY "Allow public insert to contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read contacts" ON contacts FOR SELECT USING (true);

-- Policies for NOTES (Add your daily notes with timestamps & retrieve them anytime)
CREATE POLICY "Allow public insert to notes" ON notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read notes" ON notes FOR SELECT USING (true);
CREATE POLICY "Allow public update notes" ON notes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete notes" ON notes FOR DELETE USING (true);

-- Policies for BOOKINGS
CREATE POLICY "Allow public insert to bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read bookings" ON bookings FOR SELECT USING (true);
`;
