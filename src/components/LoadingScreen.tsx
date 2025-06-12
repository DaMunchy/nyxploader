'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const letters = 'nyxploader'.split('')

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <div className="flex gap-1 text-5xl font-extrabold text-purple-300 drop-shadow-2xl">
            {letters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ y: [0, -8, 0], opacity: 1 }}
transition={{ delay: index * 0.1, duration: 1.5, repeat: Infinity }}

                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
