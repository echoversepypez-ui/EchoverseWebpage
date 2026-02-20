import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ChatbotOptionContent {
  id: string;
  chatbot_option_id: string;
  title: string;
  content: string;
  bullet_points: string[];
  additional_info: string;
  created_at: string;
  updated_at: string;
}

export interface ChatbotOption {
  id: string;
  title: string;
  emoji: string;
  order_index: number;
  description: string;
  is_admin_chat: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  chatbot_option_content?: ChatbotOptionContent;
}

export function useChatbotOptions() {
  const [options, setOptions] = useState<ChatbotOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all chatbot options with their content
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('support_chatbot_options')
          .select(`
            *,
            chatbot_option_content (
              id,
              chatbot_option_id,
              title,
              content,
              bullet_points,
              additional_info,
              created_at,
              updated_at
            )
          `)
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (fetchError) {
          setError(fetchError.message);
          console.error('Error fetching chatbot options:', fetchError);
        } else {
          setOptions(data || []);
          setError(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Create new option
  const createOption = async (option: Omit<ChatbotOption, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('support_chatbot_options')
        .insert([option])
        .select();

      if (createError) {
        throw createError;
      }

      if (data) {
        setOptions([...options, data[0]].sort((a, b) => a.order_index - b.order_index));
      }
      return { success: true, data: data?.[0] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error creating option';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update option
  const updateOption = async (id: string, updates: Partial<ChatbotOption>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('support_chatbot_options')
        .update(updates)
        .eq('id', id)
        .select();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        setOptions(options.map((opt) => (opt.id === id ? data[0] : opt)).sort((a, b) => a.order_index - b.order_index));
      }
      return { success: true, data: data?.[0] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error updating option';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Delete option
  const deleteOption = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('support_chatbot_options')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setOptions(options.filter((opt) => opt.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error deleting option';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Toggle active status
  const toggleActive = async (id: string, isActive: boolean) => {
    return updateOption(id, { is_active: !isActive });
  };

  // Update content for an option
  const updateOptionContent = async (chatbotOptionId: string, content: Omit<ChatbotOptionContent, 'id' | 'chatbot_option_id' | 'created_at' | 'updated_at'>) => {
    try {
      // First, try to update existing content
      const { data: existingData, error: fetchError } = await supabase
        .from('chatbot_option_content')
        .select('id')
        .eq('chatbot_option_id', chatbotOptionId)
        .single();

      if (existingData) {
        // Update existing content
        const { data, error: updateError } = await supabase
          .from('chatbot_option_content')
          .update(content)
          .eq('chatbot_option_id', chatbotOptionId)
          .select();

        if (updateError) throw updateError;
        return { success: true, data: data?.[0] };
      } else if (fetchError?.code === 'PGRST116') {
        // No content exists, create new
        const { data, error: createError } = await supabase
          .from('chatbot_option_content')
          .insert([{ ...content, chatbot_option_id: chatbotOptionId }])
          .select();

        if (createError) throw createError;
        return { success: true, data: data?.[0] };
      } else {
        throw fetchError;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error updating content';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    options,
    loading,
    error,
    createOption,
    updateOption,
    deleteOption,
    toggleActive,
    updateOptionContent,
  };
}
