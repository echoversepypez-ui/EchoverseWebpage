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

  useEffect(() => {
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
          setError(fetchError.message);
          setSections([]);
        } else {
          setSections(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sections');
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [sectionName]);

  const updateSection = async (
    sectionName: string,
    updates: Partial<Omit<PageSection, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('page_sections')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('section_name', sectionName);

      if (updateError) {
        setError(updateError.message);
        return false;
      }

      // Refresh sections after update
      const { data, error: refetchError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('section_name', sectionName);

      if (!refetchError && data) {
        setSections((prev) =>
          prev.map((section) =>
            section.section_name === sectionName ? data[0] : section
          )
        );
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update section');
      return false;
    }
  };

  const getSection = (sectionName: string): PageSection | undefined => {
    return sections.find((s) => s.section_name === sectionName);
  };

  return {
    sections,
    loading,
    error,
    updateSection,
    getSection,
  };
};
