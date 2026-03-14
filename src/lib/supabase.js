import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vsdkurupmcazzwrbeldh.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzZGt1cnVwbWNhenp3cmJlbGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwODA5NjUsImV4cCI6MjA4MzY1Njk2NX0.G2pM41KgndtQuFMFyyxn0Rbp9wJEUcn29IocT2pN-Lg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Confirmed table names from Supabase OpenAPI spec
export const TABLES = {
  USERS: 'portal_users_1741860000000',
  ORGANISATIONS: 'organisations_1741860000000',
  PROGRAMMES: 'programmes_1741860000000',
  ATTENDANCE: 'attendance_1741860000000',
  CERTIFICATES: 'certificates_1741860000000',
  MENTORING: 'mentoring_sessions_1741860000000',
}

// Column reference for portal_users_1741860000000:
// id, first_name, last_name, email, role, job_title, organisation_id, created_at

// Column reference for programmes_1741860000000:
// id, name, description, duration_weeks, created_at

// Column reference for attendance_1741860000000:
// id, user_id, programme_id, session_name, check_in_time, ip_address, created_at

// Column reference for mentoring_sessions_1741860000000:
// id, user_id, week_number, session_date, goal, status, private_notes, created_at

// Column reference for certificates_1741860000000:
// id, user_id, programme_id, reference_number, issue_date, status, progress_percent, created_at

// Column reference for organisations_1741860000000:
// id, name, type, contact_name, contact_email, contact_phone, staff_count, contract_start_date, status, created_at
