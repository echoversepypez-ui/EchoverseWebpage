import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface PageStat {
  id: string;
  stat_key: string;
  stat_value: string;
  stat_label: string;
  stat_description: string;
  display_order: number;
  is_active: boolean;
  updated_at: string;
  created_at: string;
}

export const usePageStats = () => {
  const [stats, setStats] = useState<PageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('page_stats')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        setError(fetchError.message);
        setStats([]);
      } else {
        setStats(data || []);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch stats';
      console.error('Exception in fetchStats:', errorMsg);
      setError(errorMsg);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const updateStat = async (
    statKey: string,
    updates: Partial<Omit<PageStat, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> => {
    try {
      console.log('Updating stat:', statKey, updates);

      const updatePayload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      console.log('Sending update payload to Supabase:', updatePayload);
      
      const { error: updateError, data: updateData, status } = await supabase
        .from('page_stats')
        .update(updatePayload)
        .eq('stat_key', statKey)
        .select();

      console.log('Supabase response status:', status);
      console.log('Supabase update data:', updateData);

      if (updateError) {
        const errorMsg = `Database update failed: ${updateError.message} (Code: ${updateError.code})`;
        console.error('Update error:', errorMsg, updateError);
        setError(errorMsg);
        return false;
      }

      if (!updateData || updateData.length === 0) {
        const warnMsg = 'Update completed but no data returned. The record may not have been updated.';
        console.warn(warnMsg);
        setError(warnMsg);
        return false;
      }

      console.log('Update successful, refreshing data...');

      // Update local state immediately
      setStats(prevStats =>
        prevStats.map(stat =>
          stat.stat_key === statKey ? { ...stat, ...updates } : stat
        )
      );

      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update stat';
      console.error('Exception in updateStat:', errorMsg);
      setError(errorMsg);
      return false;
    }
  };

  const getAllStats = async (): Promise<PageStat[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('page_stats')
        .select('*')
        .order('display_order', { ascending: true });

      if (fetchError) {
        console.error('Fetch all stats error:', fetchError);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Exception in getAllStats:', err);
      return [];
    }
  };

  return {
    stats,
    loading,
    error,
    updateStat,
    getAllStats,
    refetch: fetchStats,
  };
};
