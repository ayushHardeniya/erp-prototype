import { supabase } from '../config/supabase'

export const attendanceService = {
  // Generate QR code for attendance
  generateQRCode: async (studentId, sessionId) => {
    const data = {
      studentId,
      sessionId,
      timestamp: new Date().toISOString()
    }
    return await QRCode.toDataURL(JSON.stringify(data))
  },

  // Mark attendance using QR code data
  markAttendance: async (qrData) => {
    try {
      const data = JSON.parse(qrData)
      const { error } = await supabase
        .from('attendance')
        .insert([{
          student_id: data.studentId,
          session_id: data.sessionId,
          timestamp: data.timestamp,
          marked_at: new Date().toISOString()
        }])
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  // Get student attendance history
  getStudentAttendance: async (studentId) => {
    return await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('marked_at', { ascending: false })
  },

  // Get attendance by class/session
  getSessionAttendance: async (sessionId) => {
    return await supabase
      .from('attendance')
      .select('*, students(*)')
      .eq('session_id', sessionId)
      .order('marked_at', { ascending: false })
  },

  // Create a new attendance session
  createAttendanceSession: async (classId, subjectId, facultyId) => {
    return await supabase
      .from('attendance_sessions')
      .insert([{
        class_id: classId,
        subject_id: subjectId,
        faculty_id: facultyId,
        started_at: new Date().toISOString()
      }])
  },

  // Close an attendance session
  closeAttendanceSession: async (sessionId) => {
    return await supabase
      .from('attendance_sessions')
      .update({ ended_at: new Date().toISOString() })
      .eq('id', sessionId)
  }
}