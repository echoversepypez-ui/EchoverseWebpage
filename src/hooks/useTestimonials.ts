import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  duration: string;
  quote: string;
  rating: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📡 Fetching testimonials from dedicated table...');

      const { data, error: fetchError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        setError(fetchError.message);
        setTestimonials([]);
      } else {
        console.log(`✅ Fetched ${data?.length || 0} testimonials`);
        setTestimonials(data || []);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch testimonials';
      console.error('❌ Exception:', errorMsg);
      setError(errorMsg);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const addTestimonial = async (
    testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Testimonial | null> => {
    try {
      console.log('➕ Adding testimonial:', testimonial.name);

      // Get next display order
      const { data: existingData } = await supabase
        .from('testimonials')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);

      const nextOrder = ((existingData?.[0]?.display_order || 0) as number) + 1;

      const { data, error: insertError } = await supabase
        .from('testimonials')
        .insert([
          {
            ...testimonial,
            display_order: nextOrder,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Insert error:', insertError);
        setError(insertError.message);
        return null;
      }

      console.log('✅ Testimonial added successfully');
      setTestimonials((prev) => [...prev, data]);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add testimonial';
      console.error('❌ Exception:', errorMsg);
      setError(errorMsg);
      return null;
    }
  };

  const updateTestimonial = async (
    id: string,
    updates: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> => {
    try {
      console.log('✏️ Updating testimonial:', id);

      const { error: updateError } = await supabase
        .from('testimonials')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        setError(updateError.message);
        return false;
      }

      // Refetch to get updated data
      const { data: refreshData, error: refreshError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single();

      if (!refreshError && refreshData) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? refreshData : t))
        );
      }

      console.log('✅ Testimonial updated successfully');
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update testimonial';
      console.error('❌ Exception:', errorMsg);
      setError(errorMsg);
      return false;
    }
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting testimonial:', id);

      // Soft delete - set is_active to false
      const { error: deleteError } = await supabase
        .from('testimonials')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (deleteError) {
        console.error('❌ Delete error:', deleteError);
        setError(deleteError.message);
        return false;
      }

      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      console.log('✅ Testimonial deleted successfully');
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete testimonial';
      console.error('❌ Exception:', errorMsg);
      setError(errorMsg);
      return false;
    }
  };

  const reorderTestimonials = async (
    orderedIds: string[]
  ): Promise<boolean> => {
    try {
      console.log('🔄 Reordering testimonials');

      const updates = orderedIds.map((id, index) => ({
        id,
        display_order: index + 1,
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('testimonials')
          .update({ display_order: update.display_order, updated_at: update.updated_at })
          .eq('id', update.id);

        if (error) {
          console.error('❌ Reorder error:', error);
          setError(error.message);
          return false;
        }
      }

      // Refetch all testimonials
      await fetchTestimonials();
      console.log('✅ Testimonials reordered successfully');
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reorder testimonials';
      console.error('❌ Exception:', errorMsg);
      setError(errorMsg);
      return false;
    }
  };

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    reorderTestimonials,
  };
};
