import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  qualification?: string;
  experience_years?: number;
  language?: string;
  rating?: number;
  lessons_completed?: number;
  bio?: string;
  story?: string;
  availability?: string;
  image?: string; // Path to image in public/teachers folder (e.g., "john-doe.jpg")
  created_at?: string;
  updated_at?: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  experience?: string;
  bio?: string;
  story?: string;
  join_date?: string;
  status?: string;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department?: string;
  specialization?: string;
  bio?: string;
  story?: string;
  join_date?: string;
  status?: string;
  tickets_resolved?: number;
  satisfaction_rating?: number;
  availability?: string;
  created_at?: string;
  updated_at?: string;
}

export type ProfileType = 'teacher' | 'admin' | 'staff';

interface UseProfileManagementReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
  addProfile: (profile: Omit<T, 'id' | 'created_at' | 'updated_at'>) => Promise<T | null>;
  updateProfile: (id: string, profile: Partial<T>) => Promise<T | null>;
  deleteProfile: (id: string) => Promise<boolean>;
}

export function useTeachersProfiles(): UseProfileManagementReturn<TeacherProfile> {
  const [data, setData] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: profiles, error: err } = await supabase
        .from('teacher_profiles')
        .select('*')
        .order('name');

      if (err) throw err;
      setData(profiles || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch teachers';
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addProfile = async (profile: Omit<TeacherProfile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newProfile, error: err } = await supabase
        .from('teacher_profiles')
        .insert([profile])
        .select()
        .single();

      if (err) throw err;
      if (newProfile) {
        setData([...data, newProfile]);
        return newProfile;
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add teacher';
      setError(message);
      console.error(message);
      return null;
    }
  };

  const updateProfile = async (id: string, profile: Partial<TeacherProfile>) => {
    try {
      const { data: updated, error: err } = await supabase
        .from('teacher_profiles')
        .update({ ...profile, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      if (updated) {
        setData(data.map(p => p.id === id ? updated : p));
        return updated;
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update teacher';
      setError(message);
      console.error(message);
      return null;
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('teacher_profiles')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setData(data.filter(p => p.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete teacher';
      setError(message);
      console.error(message);
      return false;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return { data, loading, error, fetchProfiles, addProfile, updateProfile, deleteProfile };
}

export function useAdminProfiles(): UseProfileManagementReturn<AdminProfile> {
  const [data, setData] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: profiles, error: err } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('name');

      if (err) throw err;
      setData(profiles || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch admins';
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addProfile = async (profile: Omit<AdminProfile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newProfile, error: err } = await supabase
        .from('admin_profiles')
        .insert([profile])
        .select()
        .single();

      if (err) throw err;
      if (newProfile) {
        setData([...data, newProfile]);
        return newProfile;
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add admin';
      setError(message);
      console.error(message);
      return null;
    }
  };

  const updateProfile = async (id: string, profile: Partial<AdminProfile>) => {
    try {
      const { data: updated, error: err } = await supabase
        .from('admin_profiles')
        .update({ ...profile, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      if (updated) {
        setData(data.map(p => p.id === id ? updated : p));
        return updated;
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update admin';
      setError(message);
      console.error(message);
      return null;
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setData(data.filter(p => p.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete admin';
      setError(message);
      console.error(message);
      return false;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return { data, loading, error, fetchProfiles, addProfile, updateProfile, deleteProfile };
}

export function useStaffProfiles(): UseProfileManagementReturn<StaffProfile> {
  const [data, setData] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: profiles, error: err } = await supabase
        .from('support_staff')
        .select('*')
        .order('name');

      if (err) throw err;
      setData(profiles || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch support staff';
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addProfile = async (profile: Omit<StaffProfile, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: newProfile, error: err } = await supabase
        .from('support_staff')
        .insert([profile])
        .select()
        .single();

      if (err) throw err;
      if (newProfile) {
        setData([...data, newProfile]);
        return newProfile;
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add support staff';
      setError(message);
      console.error(message);
      return null;
    }
  };

  const updateProfile = async (id: string, profile: Partial<StaffProfile>) => {
    try {
      const { data: updated, error: err } = await supabase
        .from('support_staff')
        .update({ ...profile, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      if (updated) {
        setData(data.map(p => p.id === id ? updated : p));
        return updated;
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update support staff';
      setError(message);
      console.error(message);
      return null;
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('support_staff')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setData(data.filter(p => p.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete support staff';
      setError(message);
      console.error(message);
      return false;
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return { data, loading, error, fetchProfiles, addProfile, updateProfile, deleteProfile };
}

export interface JourneyStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  emoji?: string;
  color_theme?: string;
  what_happens?: string;
  time_to_complete?: string;
  duration_detail?: string;
  additional_info?: string;
  pro_tip?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseJourneyStepsReturn {
  data: JourneyStep[];
  loading: boolean;
  error: string | null;
  fetchSteps: () => Promise<void>;
  updateStep: (id: string, step: Partial<JourneyStep>) => Promise<JourneyStep | null>;
}

export function useJourneySteps(): UseJourneyStepsReturn {
  const [data, setData] = useState<JourneyStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSteps = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: steps, error: err } = await supabase
        .from('journey_steps')
        .select('*')
        .order('step_number');

      if (err) throw err;
      setData(steps || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch journey steps';
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateStep = async (id: string, step: Partial<JourneyStep>) => {
    try {
      const { data: updated, error: err } = await supabase
        .from('journey_steps')
        .update({ ...step, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      if (updated) {
        setData(data.map(s => s.id === id ? updated : s));
        return updated;
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update journey step';
      setError(message);
      console.error(message);
      return null;
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  return { data, loading, error, fetchSteps, updateStep };
}
