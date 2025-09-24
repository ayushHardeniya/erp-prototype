import { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase'
import { Link } from 'react-router-dom'
import { QrCodeIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setStudents(data || [])
    } catch (error) {
      setError('Error fetching students: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteStudent = async (id) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .match({ id })

      if (error) throw error
      setStudents(students.filter(student => student.id !== id))
    } catch (error) {
      setError('Error deleting student: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Students</h2>
        <Link to="/students/new" className="btn-primary">
          Add New Student
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {student.name?.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {student.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {student.roll_number}
                  </div>
                </div>
              </div>
              <Link
                to={`/students/${student.id}`}
                className="text-primary-600 hover:text-primary-900"
              >
                <QrCodeIcon className="h-6 w-6" />
              </Link>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {student.branch} • Year {student.year}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}