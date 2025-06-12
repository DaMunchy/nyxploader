'use client'

import { useState, useRef } from 'react'
import { UploadCloud, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingScreen from '@/components/LoadingScreen'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('Select or drop files')
  const [fileErrorVisible, setFileErrorVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [copyMessageVisible, setCopyMessageVisible] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    if (selected) {
      setSelectedFileName(selected.name)
      setFileErrorVisible(false)
    } else {
      setSelectedFileName('Select or drop files')
    }
    setShowResult(false)
    setCopyMessageVisible(false)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setFileErrorVisible(true)
      return
    }

    setFileErrorVisible(false)
    setShowResult(false)
    setCopyMessageVisible(false)
    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', file)

   try {
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("Upload response:", data);

  if (!res.ok) {
    throw new Error(data?.error || "Upload failed");
  }

  setUrl(data.url); 
  setShowResult(true); // ⬅️ Jangan lupa ini juga ditaruh sini!
} catch (err) {
  console.error("Upload error:", err);
  setUrl("");
  setShowResult(false);
}


    setIsLoading(false)
    setFile(null)
    setSelectedFileName('Select or drop files')
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleCopy = () => {
    if (!url) return
    const temp = document.createElement('textarea')
    temp.value = url
    document.body.appendChild(temp)
    temp.select()
    document.execCommand('copy')
    document.body.removeChild(temp)

    setCopyMessageVisible(true)
    setTimeout(() => setCopyMessageVisible(false), 2000)
  }

  return (
    <>
      <LoadingScreen />

      <main className="flex flex-col justify-between min-h-screen bg-gradient-to-br from-purple-950 via-purple-800 to-purple-700 text-white font-sans">
        <motion.div
          className="flex flex-col items-center justify-center flex-grow px-6 py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl font-extrabold mb-8 drop-shadow-2xl text-center"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            Nyxploader 🚀
          </motion.h1>

          <motion.form
            onSubmit={handleUpload}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl w-full max-w-md space-y-4 shadow-2xl border border-purple-500"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div
  onClick={() => inputRef.current?.click()}
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
      setSelectedFileName(droppedFile.name)
      setFileErrorVisible(false)
      setShowResult(false)
      setCopyMessageVisible(false)
    }
  }}
  className="cursor-pointer bg-purple-600 hover:bg-purple-800 transition-all duration-300 px-5 py-6 rounded-xl flex flex-col items-center justify-center gap-2 font-semibold text-white shadow-md hover:shadow-lg border-2 border-dashed border-purple-400 text-center"
>
  <UploadCloud size={28} />
  <span className="text-sm">{selectedFileName || 'Select or drop files'}</span>
  <input
    type="file"
    accept="*"
    onChange={handleFileChange}
    className="hidden"
    ref={inputRef}
  />
</div>
{file && (
  <div className="mt-2 text-center">
    {file.type.startsWith('image/') ? (
      <img
        src={URL.createObjectURL(file)}
        alt="preview"
        className="mx-auto max-h-48 rounded-lg shadow-md"
      />
    ) : file.type.startsWith('video/') ? (
      <video
        src={URL.createObjectURL(file)}
        className="mx-auto max-h-48 rounded-lg shadow-md"
        controls
      />
    ) : (
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white/10 text-white text-sm px-4 py-2 rounded-md shadow-md">
          <p className="font-semibold">Selected file:</p>
          <p className="text-purple-200">{file.name}</p>
          <p className="text-purple-300 text-xs italic">{file.type || 'Unknown type'}</p>
        </div>
      </div>
    )}
  </div>
)}




            <AnimatePresence>
              {fileErrorVisible && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-sm mt-2"
                >
                  Select the files file first.
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              className="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg hover:from-purple-500 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!file || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner border-gray-700 border-t-purple-400"></span> Uploading...
                </>
              ) : (
                'Upload'
              )}
            </motion.button>
          </motion.form>

          <AnimatePresence>
            {showResult && (
              <motion.div
                className="bg-white/10 mt-6 p-4 rounded-xl shadow-lg w-full max-w-md text-sm break-words border border-purple-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="mb-1 text-gray-200">Url :</p>
                <div className="flex items-center justify-between bg-white/5 rounded-md p-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-300 hover:text-white transition-all underline break-all flex-grow mr-2 overflow-hidden whitespace-nowrap overflow-ellipsis"
                  >
                    {url}
                  </a>
                  <button
                    onClick={handleCopy}
                    className="bg-purple-700 text-white p-2 rounded-md hover:bg-purple-600 transition-colors flex items-center justify-center"
                    aria-label="Salin URL"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <AnimatePresence>
                  {copyMessageVisible && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-green-400 text-sm mt-2"
                    >
                      Copied!
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <footer className="text-center text-sm text-purple-200 py-4 bg-purple-900/50 border-t border-purple-700">
          © {new Date().getFullYear()} <span className="font-semibold">Nyxploader</span> Powered By Munchy. All rights reserved.
        </footer>
      </main>
    </>
  )
}
