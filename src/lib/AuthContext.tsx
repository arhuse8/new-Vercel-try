import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null, 
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchProfile = async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Only create a fallback profile if registration didn't do it
        // and we are truly missing a profile record.
        const newProfile = {
          id: userId,
          name: email?.split('@')[0] || 'User',
          email: email || '',
          role: 'viewer', // Default role
          created_at: new Date().toISOString()
        };
        
        const { data: created, error: insError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
          
        if (!insError) setProfile(created);
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          const sessionUser = session?.user ?? null;
          setUser(sessionUser);
          if (sessionUser) {
            await fetchProfile(sessionUser.id, sessionUser.email);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        if (mounted) setLoading(false);
      }
    }

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        if (sessionUser) {
          await fetchProfile(sessionUser.id, sessionUser.email);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      mountedRef.current = false;
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      // Optimistic state clear for instant UI feedback
      setUser(null);
      setProfile(null);
      
      // We don't necessarily need to set loading(true) here as we want the app to stay responsive
      // The ProtectedRoute will see user is null and handle redirection
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      // Ensure loading is false in case it was true
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
