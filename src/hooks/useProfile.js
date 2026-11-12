import { useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_DAILY_LIMIT } from '../lib/constants';

export function useProfile() {
  const { profile, updateProfile, loading } = useAuth();

  const fallbackProfile = useMemo(
    () => ({
      id: 'local-user',
      full_name: 'Pejuang Lingkungan',
      daily_limit: DEFAULT_DAILY_LIMIT,
      total_trees: 0,
      streak_days: 1,
      points: 0,
      created_at: new Date().toISOString(),
    }),
    []
  );

  const currentProfile = profile || fallbackProfile;
  const dailyLimit =
    currentProfile?.daily_limit != null
      ? Number(currentProfile.daily_limit)
      : DEFAULT_DAILY_LIMIT;

  const updateDailyLimit = useCallback(
    async (newLimit) => {
      const numLimit = Number(newLimit);
      const safeLimit = isNaN(numLimit) || numLimit <= 0 ? DEFAULT_DAILY_LIMIT : numLimit;
      return await updateProfile({ daily_limit: safeLimit });
    },
    [updateProfile]
  );

  return {
    profile: currentProfile,
    dailyLimit,
    updateDailyLimit,
    loading,
  };
}

export default useProfile;
