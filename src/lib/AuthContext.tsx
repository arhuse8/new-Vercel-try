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
        // Create profile if it doesn't exist
        const newProfile = {
          id: userId,
          name: email?.split('@')[0] || 'User',
          email: email || '',
          role: email === 'arhuse8@gmail.com' ? 'dev' : 'user',
          created_at: new Date().toISOString()
        };
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
        
        if (!createError) {
          setProfile(createdProfile);
        }
      }
    } catch (error) {
      console.error("Error fetching profile", error);
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
            fetchProfile(sessionUser.id, sessionUser.email).catch(err => console.error("Profile fetch error during init:", err));
          }
          // Set loading false as soon as session is checked
          setLoading(false);
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
          fetchProfile(sessionUser.id, sessionUser.email).catch(err => console.error("Profile fetch error during auth change:", err));
        } else {
          setProfile(null);
        }
        setLoading(false);
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
      setLoading(true);
      // Optimistic state clear to make the UI responsive immediately
      setUser(null);
      setProfile(null);
      
      // Attempt network signout but don't hang the app if it fails/times out
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 2000)
      );
      
      await Promise.race([signOutPromise, timeoutPromise]).catch(err => {
        console.warn("Sign out background task warning:", err);
      });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
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
