import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../config/supabase'
import { QRCodeSVG } from 'qrcode.react'
import {
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  CurrencyRupeeIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

const tabs = [
  { name: 'Personal Info', key: 'info', icon: UserIcon },
  { name: 'Attendance', key: 'attendance', icon: ClipboardDocumentListIcon },
  { name: 'Grades', key: 'grades', icon: AcademicCapIcon },
  { name: 'Fees', key: 'fees', icon: CurrencyRupeeIcon },
]

export default function StudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('info')

  useEffect(() => {
    fetchStudentDetails()
  }, [id])

  const fetchStudentDetails = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          attendance:attendance(*),
          grades:grades(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setStudent(data)
    } catch (error) {
      setError('Error fetching student details: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        {error}
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Student not found</h3>
        <Link to="/students" className="mt-4 btn-primary inline-block">
          Back to Students
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Student Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {student.name}
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <AcademicCapIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {student.branch} - Year {student.year}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                Roll No: {student.roll_number}
              </div>
            </div>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <Link
              to={`/students/${id}/edit`}
              className="btn-secondary mr-3"
            >
              Edit Profile
            </Link>
            <button className="btn-primary">
              Generate ID Card
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { name: 'Personal Info', key: 'info', icon: UserIcon },
            { name: 'Attendance', key: 'attendance', icon: ClipboardDocumentListIcon },
            { name: 'Grades', key: 'grades', icon: AcademicCapIcon },
            { name: 'Fees', key: 'fees', icon: CurrencyRupeeIcon },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon
                className={`-ml-0.5 mr-2 h-5 w-5 ${
                  activeTab === tab.key ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.address}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Parent/Guardian Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.parent_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Parent/Guardian Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{student.parent_phone}</dd>
                </div>
              </dl>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance QR Code</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                <QRCodeSVG
                  value={`student-${student.id}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Record</h3>
            {/* Add attendance table/chart here */}
          </div>
        )}

        {activeTab === 'grades' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Performance</h3>
            {/* Add grades table/chart here */}
          </div>
        )}

        {activeTab === 'fees' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Details</h3>
            {/* Add fee details here */}
          </div>
        )}
      </div>
    </div>
  )
}