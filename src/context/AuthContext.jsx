import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile data from the database
  const fetchUserProfile = async (userId, role) => {
    try {
      setLoadingProfile(true);
      
      // Determine which table to query based on role
      let tableName;
      switch (role) {
        case 'student':
          tableName = 'students';
          break;
        case 'faculty':
          tableName = 'faculty';
          break;
        case 'admin':
          tableName = 'admins';
          break;
        default:
          throw new Error('Invalid user role');
      }
      
      // Fetch profile data from appropriate table
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) throw error;
      
      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      toast.error('Failed to load profile data');
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // If session exists, set user and fetch profile
        if (session?.user) {
          setUser(session.user);
          
          // Get user role from metadata
          const role = session.user.user_metadata?.role || 'student';
          setUserRole(role);
          
          // Fetch additional profile data
          await fetchUserProfile(session.user.id, role);
        }
      } catch (error) {
        console.error('Auth error:', error.message);
        toast.error('Authentication error occurred');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (session?.user) {
          setUser(session.user);
          
          // Get user role from metadata
          const role = session.user.user_metadata?.role || 'student';
          setUserRole(role);
          
          // Fetch additional profile data
          await fetchUserProfile(session.user.id, role);
          
          if (event === 'SIGNED_IN') {
            toast.success('Successfully signed in!');
            navigate('/dashboard');
          }
        } else {
          // Clear user data on signout
          setUser(null);
          setUserRole(null);
          setUserProfile(null);
          
          if (event === 'SIGNED_OUT') {
            toast.success('Successfully signed out!');
            navigate('/');
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  // Login function
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
      return { data: null, error };
    }
  };

  // Signup function with role
  const signup = async (email, password, role, userData) => {
    try {
      // Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      });
      
      if (authError) throw authError;
      
      // If signup successful, create profile record in appropriate table
      if (authData?.user) {
        let tableName;
        switch (role) {
          case 'student':
            tableName = 'students';
            break;
          case 'faculty':
            tableName = 'faculty';
            break;
          case 'admin':
            tableName = 'admins';
            break;
          default:
            throw new Error('Invalid user role');
        }
        
        // Insert profile data
        const { error: profileError } = await supabase
          .from(tableName)
          .insert([{
            user_id: authData.user.id,
            email: authData.user.email,
            ...userData
          }]);
          
        if (profileError) throw profileError;
      }
      
      toast.success('Registration successful! Please check your email for verification.');
      return { data: authData, error: null };
    } catch (error) {
      toast.error(`Registration failed: ${error.message}`);
      return { data: null, error };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
      return { error };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      if (!user || !userRole) throw new Error('User not authenticated');
      
      // Determine which table to update based on role
      let tableName;
      switch (userRole) {
        case 'student':
          tableName = 'students';
          break;
        case 'faculty':
          tableName = 'faculty';
          break;
        case 'admin':
          tableName = 'admins';
          break;
        default:
          throw new Error('Invalid user role');
      }
      
      // Update profile data
      const { data, error } = await supabase
        .from(tableName)
        .update(profileData)
        .eq('user_id', user.id)
        .single();
        
      if (error) throw error;
      
      // Update local state
      setUserProfile({
        ...userProfile,
        ...profileData
      });
      
      toast.success('Profile updated successfully');
      return { data, error: null };
    } catch (error) {
      toast.error(`Profile update failed: ${error.message}`);
      return { data: null, error };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
      return { data, error: null };
    } catch (error) {
      toast.error(`Password reset failed: ${error.message}`);
      return { data: null, error };
    }
  };

  // Check if user has permission based on role
  const hasPermission = (requiredRoles) => {
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  };

  // Provide auth context value
  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      userProfile,
      loading,
      loadingProfile,
      login,
      signup,
      logout,
      updateProfile,
      resetPassword,
      hasPermission
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};