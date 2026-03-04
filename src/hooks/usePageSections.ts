import { useEffect, useState, useRef } from 'react';
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
  const subscriptionRef = useRef<any>(null);

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

  // Set up real-time subscription
  const setupRealtimeSubscription = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    const subscription = supabase
      .channel('page_sections_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_sections',
          ...(sectionName && { filter: `section_name=eq.${sectionName}` })
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          // Dispatch custom event for UI indicators
          const eventName = payload.eventType === 'UPDATE' ? 'Content updated' : 'Content changed';
          const newData = payload.new as PageSection | undefined;
          const oldData = payload.old as PageSection | undefined;
          window.dispatchEvent(new CustomEvent('realtime-update', {
            detail: { message: `${eventName}: ${newData?.section_name || oldData?.section_name}` }
          }));
          
          if (payload.eventType === 'UPDATE') {
            const updatedSection = payload.new as PageSection;
            setSections(prev => 
              prev.map(section => 
                section.section_name === updatedSection.section_name 
                  ? updatedSection 
                  : section
              )
            );
          } else if (payload.eventType === 'INSERT') {
            const newSection = payload.new as PageSection;
            setSections(prev => {
              const exists = prev.find(s => s.section_name === newSection.section_name);
              if (!exists) {
                return [...prev, newSection];
              }
              return prev.map(section => 
                section.section_name === newSection.section_name 
                  ? newSection 
                  : section
              );
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedSection = payload.old as PageSection;
            setSections(prev => 
              prev.filter(section => section.section_name !== deletedSection.section_name)
            );
          }
        }
      )
      .subscribe();

    subscriptionRef.current = subscription;
  };

  useEffect(() => {
    fetchSections();
    setupRealtimeSubscription();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [sectionName]);

  const updateSection = async (
    sectionName: string,
    updates: Partial<Omit<PageSection, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> => {
    try {
      console.log('Updating section:', sectionName, updates);

      // Validate content structure
      if (!updates.content) {
        const errMsg = 'Content is required';
        console.error(errMsg);
        setError(errMsg);
        return false;
      }

      const updatePayload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      console.log('Sending update payload to Supabase:', updatePayload);
      
      const { error: updateError, data: updateData, status } = await supabase
        .from('page_sections')
        .update(updatePayload)
        .eq('section_name', sectionName)
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

      // Immediately refresh the specific section
      const { data: refreshData, error: refreshError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('section_name', sectionName);

      if (refreshError) {
        const errorMsg = `Refresh failed: ${refreshError.message}`;
        console.error('Refresh error:', errorMsg);
        setError(errorMsg);
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
      } else {
        console.warn('No data returned from refresh query');
      }

      setError(null);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update section';
      console.error('Exception in updateSection:', errorMsg, err);
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
