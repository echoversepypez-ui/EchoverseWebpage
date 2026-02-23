import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: 'boolean' | 'string' | 'number' | 'json';
  description?: string;
  created_at: string;
  updated_at: string;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<Map<string, SystemSetting>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch all system settings
  useEffect(() => {
    fetchSettings();
  }, [refreshTrigger]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('system_settings')
        .select('*');

      if (fetchError) throw fetchError;

      const settingsMap = new Map<string, SystemSetting>();
      data?.forEach((setting) => {
        settingsMap.set(setting.setting_key, setting);
      });
      setSettings(settingsMap);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(message);
      console.error('Error fetching system settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = useCallback((key: string): string | null => {
    const setting = settings.get(key);
    return setting?.setting_value || null;
  }, [settings]);

  const getBooleanSetting = useCallback((key: string): boolean => {
    const value = getSetting(key);
    return value === 'true' || value === '1';
  }, [getSetting]);

  const updateSetting = async (
    settingKey: string,
    settingValue: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: updateError } = await supabase
        .from('system_settings')
        .update({ setting_value: settingValue, updated_at: new Date().toISOString() })
        .eq('setting_key', settingKey);

      if (updateError) throw updateError;

      // Update local state
      const setting = settings.get(settingKey);
      if (setting) {
        setSettings(
          new Map(settings).set(settingKey, {
            ...setting,
            setting_value: settingValue,
            updated_at: new Date().toISOString(),
          })
        );
      }

      // Trigger a refresh to ensure sync
      setRefreshTrigger(prev => prev + 1);

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update setting';
      console.error('Error updating system setting:', err);
      return { success: false, error: message };
    }
  };

  const toggleBooleanSetting = async (
    settingKey: string
  ): Promise<{ success: boolean; newValue?: boolean; error?: string }> => {
    const currentValue = getBooleanSetting(settingKey);
    const newValue = !currentValue;
    const result = await updateSetting(settingKey, newValue ? 'true' : 'false');
    return {
      ...result,
      newValue: newValue,
    };
  };

  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return {
    settings,
    loading,
    error,
    getSetting,
    getBooleanSetting,
    updateSetting,
    toggleBooleanSetting,
    refresh,
  };
}
