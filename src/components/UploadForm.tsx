'use client'

import { useState } from 'react'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()

      if (res.ok) {
        setUrl(result.url)
      } else {
        setError(result.error || 'Upload gagal')
      }
    } catch {
      setError('Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload Gambar</h2>
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {url && (
        <p className="mt-4 text-green-600">
          URL Gambar: <a href={url} target="_blank" className="underline">{url}</a>
        </p>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}
