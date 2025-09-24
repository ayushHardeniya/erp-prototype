import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { attendanceService } from '../../services/attendanceService'
import toast from 'react-hot-toast'

export default function QRCodeScanner({ sessionId, onScanComplete }) {
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    })

    scanner.render(async (data) => {
      if (data) {
        scanner.pause()
        try {
          const result = await attendanceService.markAttendance(data)
          if (result.success) {
            toast.success('Attendance marked successfully')
            if (onScanComplete) onScanComplete(data)
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          toast.error('Failed to mark attendance: ' + error.message)
        }
        setTimeout(() => scanner.resume(), 3000)
      }
    }, (error) => {
      if (error) {
        console.error(error)
      }
    })

    return () => {
      scanner.clear()
    }
  }, [])

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Scan Attendance QR Code</h2>
        <div id="reader" className="w-full"></div>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Point your camera at the student's QR code to mark attendance
        </p>
      </div>
    </div>
  )
}