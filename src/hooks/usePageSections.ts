import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface PageSection {
  id: string;
  section_name: string;
  title: string;
  subtitle: string;
  content: Record<string, unknown>;
  updated_at: string;
  created_at: string;
}

export const usePageSections = (sectionName?: string) => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('page_sections').select('*');

      if (sectionName) {
        query = query.eq('section_name', sectionName);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        setError(fetchError.message);
        setSections([]);
      } else {
        setSections(data || []);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch sections';
      console.error('Exception in fetchSections:', errorMsg);
      setError(errorMsg);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [sectionName]);

  const updateSection = async (
    sectionName: string,
    updates: Partial<Omit<PageSection, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> => {
    try {
      console.log('Updating section:', sectionName, updates);

      // Validate content structure
      if (!updates.content) {
        setError('Content is required');
        return false;
      }

      const updatePayload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError, data: updateData } = await supabase
        .from('page_sections')
        .update(updatePayload)
        .eq('section_name', sectionName)
        .select();

      if (updateError) {
        console.error('Update error:', updateError);
        setError(updateError.message);
        return false;
      }

      console.log('Update successful, refreshing data...');

      // Immediately refresh the specific section
      const { data: refreshData, error: refreshError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('section_name', sectionName);

      if (refreshError) {
        console.error('Refresh error:', refreshError);
        setError(refreshError.message);
        return false;
      }

      if (refreshData && refreshData.length > 0) {
        console.log('Refreshed data:', refreshData[0]);
        setSections((prev) => {
          const updated = prev.map((section) =>
            section.section_name === sectionName ? refreshData[0] : section
          );
          
          // If section doesn't exist in prev, add it
          if (!prev.find(s => s.section_name === sectionName)) {
            return [...updated, refreshData[0]];
          }
          
          return updated;
        });
      }

      setError(null);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update section';
      console.error('Exception in updateSection:', errorMsg);
      setError(errorMsg);
      return false;
    }
  };

  const getSection = (sectionName: string): PageSection | undefined => {
    return sections.find((s) => s.section_name === sectionName);
  };

  const refetchSection = async (sectionName: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('section_name', sectionName);

      if (fetchError) {
        console.error('Refetch error:', fetchError);
        return false;
      }

      if (data && data.length > 0) {
        setSections((prev) =>
          prev.map((section) =>
            section.section_name === sectionName ? data[0] : section
          )
        );
        return true;
      }

      return false;
    } catch (err) {
      console.error('Exception in refetchSection:', err);
      return false;
    }
  };

  return {
    sections,
    loading,
    error,
    updateSection,
    getSection,
    refetchSection,
  };
};
