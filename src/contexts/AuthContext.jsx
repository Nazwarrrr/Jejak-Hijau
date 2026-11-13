import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEFAULT_DAILY_LIMIT } from '../lib/constants';

const AuthContext = createContext(null);

const AUTH_USER_KEY = 'jejakhijau-auth-user';
const PROFILE_KEY = 'jejakhijau-profile';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile helper for Supabase
  const loadSupabaseProfile = useCallback(async (userId, fallbackName = '') => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Gagal memuat profil Supabase:', error.message);
        return null;
      }

      if (data) {
        setProfile(data);
        return data;
      }

      // If profile doesn't exist yet, insert a default one
      const defaultProf = {
        id: userId,
        full_name: fallbackName || 'Pejuang Lingkungan',
        daily_limit: DEFAULT_DAILY_LIMIT,
        total_trees: 0,
        streak_days: 1,
        points: 0,
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .upsert(defaultProf)
        .select()
        .single();

      if (createError) {
        console.error('Gagal membuat profil Supabase:', createError.message);
        return null;
      }

      const loadedProfile = createdProfile || defaultProf;
      setProfile(loadedProfile);
      return loadedProfile;
    } catch (err) {
      console.error('Error unexpected saat memuat profil:', err);
      return null;
    }
  }, []);

  // Initialize Auth state
  useEffect(() => {
    let mounted = true;
    let authSubscription;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          // Supabase mode
          const { data: { session } } = await supabase.auth.getSession();
          if (!mounted) return;

          if (mounted && session?.user) {
            setUser(session.user);
            await loadSupabaseProfile(
              session.user.id,
              session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
            );
          } else if (mounted) {
            setUser(null);
            setProfile(null);
          }

          // Listen for auth changes
          const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            if (session?.user) {
              setUser(session.user);
              setTimeout(() => {
                if (mounted) {
                  loadSupabaseProfile(
                    session.user.id,
                    session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
                  );
                }
              }, 0);
            } else {
              setUser(null);
              setProfile(null);
            }
          });
          authSubscription = authListener?.subscription;
        } else {
          // Offline / LocalStorage Mock Mode
          const savedUser = localStorage.getItem(AUTH_USER_KEY);
          const savedProfile = localStorage.getItem(PROFILE_KEY);

          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              setUser(parsedUser);

              if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
              } else {
                const defaultProf = {
                  id: parsedUser.id,
                  full_name: parsedUser.user_metadata?.full_name || 'Pejuang Lingkungan',
                  daily_limit: DEFAULT_DAILY_LIMIT,
                  total_trees: 0,
                  streak_days: 1,
                  points: 0,
                  created_at: new Date().toISOString(),
                };
                localStorage.setItem(PROFILE_KEY, JSON.stringify(defaultProf));
                setProfile(defaultProf);
              }
            } catch (e) {
              console.error('Error membaca data auth lokal:', e);
            }
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
      authSubscription?.unsubscribe();
    };
  }, [loadSupabaseProfile]);

  // Sign In
  const signIn = useCallback(async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) return { data: null, error };
        if (data?.user) {
          setUser(data.user);
          await loadSupabaseProfile(data.user.id, data.user.user_metadata?.full_name);
        }
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }

    // Offline mock sign in
    try {
      const savedUserStr = localStorage.getItem(AUTH_USER_KEY);
      let mockUser = savedUserStr ? JSON.parse(savedUserStr) : null;

      if (!mockUser || mockUser.email !== email) {
        mockUser = {
          id: `user-${Math.random().toString(36).substring(2, 11)}`,
          email,
          user_metadata: { full_name: email.split('@')[0] },
          created_at: new Date().toISOString(),
        };
      }

      let prof = null;
      const savedProfStr = localStorage.getItem(PROFILE_KEY);
      if (savedProfStr) {
        prof = JSON.parse(savedProfStr);
      } else {
        prof = {
          id: mockUser.id,
          full_name: mockUser.user_metadata?.full_name || 'Pejuang Lingkungan',
          daily_limit: DEFAULT_DAILY_LIMIT,
          total_trees: 0,
          streak_days: 1,
          points: 0,
          created_at: new Date().toISOString(),
        };
      }

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(prof));
      setUser(mockUser);
      setProfile(prof);

      return { data: { user: mockUser }, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }, [loadSupabaseProfile]);

  // Sign Up
  const signUp = useCallback(async (email, password, fullName) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) return { data: null, error };

        if (data?.user && data?.session) {
          const newProfile = {
            id: data.user.id,
            full_name: fullName,
            daily_limit: DEFAULT_DAILY_LIMIT,
            total_trees: 0,
            streak_days: 1,
            points: 0,
          };

          setUser(data.user);
          setProfile(newProfile);
        }

        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }

    // Offline mock sign up
    try {
      const mockUser = {
        id: `user-${Math.random().toString(36).substring(2, 11)}`,
        email,
        user_metadata: { full_name: fullName },
        created_at: new Date().toISOString(),
      };

      const mockProfile = {
        id: mockUser.id,
        full_name: fullName,
        daily_limit: DEFAULT_DAILY_LIMIT,
        total_trees: 0,
        streak_days: 1,
        points: 0,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(mockProfile));
      setUser(mockUser);
      setProfile(mockProfile);

      return { data: { user: mockUser }, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    setUser(null);
    setProfile(null);
  }, []);

  // Update Profile
  const updateProfile = useCallback(async (updates) => {
    if (isSupabaseConfigured && supabase) {
      if (!user) return { error: new Error('Sesi pengguna tidak ditemukan.') };
      try {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);

        if (error) {
          console.error('Error update profil Supabase:', error);
          return { error };
        }

        setProfile((prev) => ({ ...prev, ...updates }));
        return { error: null };
      } catch (err) {
        return { error: err };
      }
    }

    // Offline mock update
    try {
      setProfile((prev) => {
        const updated = { ...(prev || {}), ...updates };
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
        return updated;
      });
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      isConfigured: isSupabaseConfigured,
    }),
    [user, profile, loading, signIn, signUp, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export default useAuth;
