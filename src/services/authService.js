import { supabase } from '../config/supabase'

export const authService = {
  // Sign up
  signUp: async (email, password, role = 'student') => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }
      }
    })
  },

  // Sign in
  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // Password reset
  resetPassword: async (email) => {
    return await supabase.auth.resetPasswordForEmail(email)
  },

  // Get current session
  getSession: async () => {
    return await supabase.auth.getSession()
  },

  // Update user
  updateUser: async (updates) => {
    return await supabase.auth.updateUser(updates)
  }
}