import { supabase } from '../config/supabase'

export const studentService = {
  // Get all students
  getAllStudents: async () => {
    return await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
  },

  // Get student by ID
  getStudentById: async (id) => {
    return await supabase
      .from('students')
      .select(`
        *,
        attendance:attendance(*),
        grades:grades(*),
        fees:fees(*)
      `)
      .eq('id', id)
      .single()
  },

  // Create student
  createStudent: async (data) => {
    return await supabase
      .from('students')
      .insert([data])
  },

  // Update student
  updateStudent: async (id, data) => {
    return await supabase
      .from('students')
      .update(data)
      .eq('id', id)
  },

  // Delete student
  deleteStudent: async (id) => {
    return await supabase
      .from('students')
      .delete()
      .eq('id', id)
  },

  // Upload student photo
  uploadStudentPhoto: async (file, studentId) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${studentId}.${fileExt}`
    const filePath = `student-photos/${fileName}`

    return await supabase.storage
      .from('student-photos')
      .upload(filePath, file, {
        upsert: true
      })
  }
}