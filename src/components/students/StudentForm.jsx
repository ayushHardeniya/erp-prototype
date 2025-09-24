import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../config/supabase'
import toast from 'react-hot-toast'

export default function StudentForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id

  const [loading, setLoading] = useState(false)
  const [student, setStudent] = useState({
    name: '',
    email: '',
    roll_number: '',
    branch: '',
    year: '',
    phone: '',
    address: '',
    parent_name: '',
    parent_phone: '',
  })

  useEffect(() => {
    if (isEditing) {
      fetchStudent()
    }
  }, [id])

  const fetchStudent = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (data) setStudent(data)
    } catch (error) {
      toast.error('Error fetching student: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (isEditing) {
        const { error } = await supabase
          .from('students')
          .update(student)
          .eq('id', id)
        
        if (error) throw error
        toast.success('Student updated successfully')
      } else {
        const { error } = await supabase
          .from('students')
          .insert([student])
        
        if (error) throw error
        toast.success('Student added successfully')
      }
      
      navigate('/students')
    } catch (error) {
      toast.error('Error saving student: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setStudent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditing ? 'Edit Student' : 'Add New Student'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="input-field mt-1"
              value={student.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="input-field mt-1"
              value={student.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="roll_number" className="block text-sm font-medium text-gray-700">
              Roll Number
            </label>
            <input
              type="text"
              name="roll_number"
              id="roll_number"
              required
              className="input-field mt-1"
              value={student.roll_number}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
              Branch
            </label>
            <select
              name="branch"
              id="branch"
              required
              className="input-field mt-1"
              value={student.branch}
              onChange={handleChange}
            >
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="ME">Mechanical</option>
              <option value="CE">Civil</option>
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <select
              name="year"
              id="year"
              required
              className="input-field mt-1"
              value={student.year}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="input-field mt-1"
              value={student.phone}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              id="address"
              rows={3}
              className="input-field mt-1"
              value={student.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700">
              Parent/Guardian Name
            </label>
            <input
              type="text"
              name="parent_name"
              id="parent_name"
              className="input-field mt-1"
              value={student.parent_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="parent_phone" className="block text-sm font-medium text-gray-700">
              Parent/Guardian Phone
            </label>
            <input
              type="tel"
              name="parent_phone"
              id="parent_phone"
              className="input-field mt-1"
              value={student.parent_phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  )
}