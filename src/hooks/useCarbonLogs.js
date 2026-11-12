import { useState, useEffect, useMemo, useCallback } from 'react';
import { getLocalDateKey, getDayName, generateId } from '../lib/utils';
import { STORAGE_KEYS } from '../lib/constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useCarbonLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync / Load logs based on auth & Supabase configuration
  useEffect(() => {
    let mounted = true;

    async function loadLogs() {
      setLoading(true);
      try {
        if (isSupabaseConfigured && supabase && user) {
          const { data, error } = await supabase
            .from('carbon_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.warn('Gagal memuat log emisi dari Supabase:', error.message);
          } else if (mounted && data) {
            setLogs(data);
            return;
          }
        }

        // Offline / LocalStorage Mode
        const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
        if (mounted) {
          if (savedLogs) {
            try {
              setLogs(JSON.parse(savedLogs));
            } catch (e) {
              console.error('Gagal parsing local carbon logs:', e);
              setLogs([]);
            }
          } else {
            setLogs([]);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadLogs();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Add Log
  const addLog = useCallback(
    async (logData) => {
      const newLog = {
        id: generateId(),
        user_id: user?.id || 'local-user',
        activity: logData.activity,
        category: logData.category,
        amount: Number(logData.amount),
        unit: logData.unit,
        emissions: Number(logData.emissions),
        date: getLocalDateKey(),
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && supabase && user) {
        try {
          const { data, error } = await supabase
            .from('carbon_logs')
            .insert([
              {
                user_id: user.id,
                activity: newLog.activity,
                category: newLog.category,
                amount: newLog.amount,
                unit: newLog.unit,
                emissions: newLog.emissions,
                date: newLog.date,
              },
            ])
            .select()
            .single();

          if (error) {
            console.error('Error insert carbon log Supabase:', error);
            // Fallback to local insertion so UX is not blocked
            setLogs((prev) => [newLog, ...prev]);
            return { data: newLog, error };
          }

          const createdLog = data || newLog;
          setLogs((prev) => [createdLog, ...prev]);
          return { data: createdLog, error: null };
        } catch (err) {
          console.error('Exception insert carbon log:', err);
          setLogs((prev) => [newLog, ...prev]);
          return { data: newLog, error: err };
        }
      }

      // Offline / LocalStorage
      setLogs((prev) => {
        const updated = [newLog, ...prev];
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
        return updated;
      });

      return { data: newLog, error: null };
    },
    [user]
  );

  // Delete Log
  const deleteLog = useCallback(
    async (id) => {
      if (isSupabaseConfigured && supabase && user) {
        try {
          const { error } = await supabase
            .from('carbon_logs')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error delete carbon log Supabase:', error);
            return { error };
          }

          setLogs((prev) => prev.filter((log) => log.id !== id));
          return { error: null };
        } catch (err) {
          console.error('Exception delete carbon log:', err);
          return { error: err };
        }
      }

      // Offline / LocalStorage
      setLogs((prev) => {
        const updated = prev.filter((log) => log.id !== id);
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
        return updated;
      });

      return { error: null };
    },
    [user]
  );

  // Today Logs
  const todayLogs = useMemo(() => {
    const todayKey = getLocalDateKey();
    return logs.filter((log) => {
      const logDateKey =
        log.date || (log.created_at ? getLocalDateKey(new Date(log.created_at)) : '');
      return logDateKey === todayKey;
    });
  }, [logs]);

  // Week Logs (past 7 days)
  const weekLogs = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return logs.filter((log) => {
      const logDate = log.date
        ? new Date(log.date)
        : log.created_at
        ? new Date(log.created_at)
        : new Date();
      return logDate >= sevenDaysAgo;
    });
  }, [logs]);

  // Totals
  const todayTotal = useMemo(() => {
    const sum = todayLogs.reduce((acc, log) => acc + (Number(log.emissions) || 0), 0);
    return Number(sum.toFixed(2));
  }, [todayLogs]);

  const weekTotal = useMemo(() => {
    const sum = weekLogs.reduce((acc, log) => acc + (Number(log.emissions) || 0), 0);
    return Number(sum.toFixed(2));
  }, [weekLogs]);

  // 7 Days Chart Data
  const chartData = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = getLocalDateKey(d);
      const dayName = getDayName(d);

      const dayEmissions = logs
        .filter((log) => {
          const logDateKey =
            log.date || (log.created_at ? getLocalDateKey(new Date(log.created_at)) : '');
          return logDateKey === dateKey;
        })
        .reduce((sum, log) => sum + (Number(log.emissions) || 0), 0);

      result.push({
        day: dayName,
        date: dateKey,
        total: Number(dayEmissions.toFixed(2)),
        isToday: i === 0,
      });
    }
    return result;
  }, [logs]);

  return {
    logs,
    todayLogs,
    weekLogs,
    todayTotal,
    weekTotal,
    addLog,
    deleteLog,
    loading,
    chartData,
  };
}

export default useCarbonLogs;
