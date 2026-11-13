import { useState, useEffect, useMemo, useCallback } from 'react';
import { getLocalDateKey, getDayName, generateId } from '../lib/utils';
import { STORAGE_KEYS } from '../lib/constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useCarbonLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Sync / Load logs based on auth & Supabase configuration
  useEffect(() => {
    let mounted = true;

    async function loadLogs() {
      setLoading(true);
      setLoadError('');
      try {
        if (isSupabaseConfigured) {
          if (!supabase || !user) throw new Error('Sesi pengguna tidak ditemukan.');
          const { data, error } = await supabase
            .from('carbon_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (mounted) setLogs(data || []);
          return;
        }

        const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
        if (mounted) {
          setLogs(savedLogs ? JSON.parse(savedLogs) : []);
        }
      } catch (error) {
        console.error('Gagal memuat log emisi:', error);
        if (mounted) {
          setLogs([]);
          setLoadError('Riwayat aktivitas gagal dimuat. Periksa koneksi lalu muat ulang halaman.');
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

      if (isSupabaseConfigured) {
        if (!supabase || !user) {
          return { data: null, error: new Error('Sesi pengguna tidak ditemukan.') };
        }
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
            return { data: null, error };
          }

          const createdLog = data;
          setLogs((prev) => [createdLog, ...prev]);
          return { data: createdLog, error: null };
        } catch (err) {
          console.error('Exception insert carbon log:', err);
          return { data: null, error: err };
        }
      }

      try {
        const updated = [newLog, ...logs];
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
        setLogs(updated);
        return { data: newLog, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    [logs, user]
  );

  // Delete Log
  const deleteLog = useCallback(
    async (id) => {
      if (isSupabaseConfigured) {
        if (!supabase || !user) return { error: new Error('Sesi pengguna tidak ditemukan.') };
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

      try {
        const updated = logs.filter((log) => log.id !== id);
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
        setLogs(updated);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    [logs, user]
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
    loadError,
    chartData,
  };
}

export default useCarbonLogs;
