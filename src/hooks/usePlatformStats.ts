import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface PlatformStats {
  teachingAccounts: number;
  totalStudentSlots: number;
  averageHourlyRate: number;
  countriesServed: number;
  loading: boolean;
  error: string | null;
}

export const usePlatformStats = (): PlatformStats => {
  const [stats, setStats] = useState<PlatformStats>({
    teachingAccounts: 0,
    totalStudentSlots: 0,
    averageHourlyRate: 0,
    countriesServed: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!supabase) {
          throw new Error('Supabase not initialized');
        }

        const { data, error } = await supabase
          .from('teaching_accounts')
          .select('id, rate_per_hour, available_slots, country');

        if (error) throw error;

        if (data && data.length > 0) {
          const totalSlots = data.reduce((sum, acc) => sum + (acc.available_slots || 0), 0);
          const avgRate = data.reduce((sum, acc) => sum + acc.rate_per_hour, 0) / data.length;
          const uniqueCountries = new Set(data.map((acc) => acc.country)).size;

          setStats({
            teachingAccounts: data.length,
            totalStudentSlots: totalSlots,
            averageHourlyRate: Math.round(avgRate * 10) / 10,
            countriesServed: uniqueCountries,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to load statistics',
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
