import { useState } from 'react'
import { attendanceService } from '../../services/attendanceService'
import QRCode from 'qrcode.react'
import toast from 'react-hot-toast'

export default function QRCodeGenerator({ studentId }) {
  const [qrValue, setQrValue] = useState('')
  const [loading, setLoading] = useState(false)

  const generateQRCode = async () => {
    setLoading(true)
    try {
      const session = await attendanceService.createAttendanceSession(studentId)
      setQrValue(session.id)
      toast.success('QR Code generated successfully')
    } catch (error) {
      toast.error('Failed to generate QR Code: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Attendance QR Code</h2>
        <button
          onClick={generateQRCode}
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate New QR'}
        </button>
      </div>

      {qrValue ? (
        <div className="flex flex-col items-center">
          <div className="p-4 bg-white rounded-lg shadow-inner">
            <QRCode value={qrValue} size={256} level="H" />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Show this QR code to mark your attendance
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500">Click generate to create a new QR code</p>
        </div>
      )}
    </div>
  )
}