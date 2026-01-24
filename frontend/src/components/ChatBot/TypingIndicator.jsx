import { motion } from 'framer-motion'

// Shows a friendly robot while the assistant is generating a reply
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="message bot"
    >
      <div className="message-content">
        <div className="message-avatar robot-avatar">
          <motion.div
            className="robot-head"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="robotGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6EE7FF" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
              <rect x="8" y="10" width="32" height="24" rx="6" fill="url(#robotGradient)" />
              <rect x="12" y="14" width="24" height="16" rx="4" fill="#0B1021" />
              <circle cx="18" cy="22" r="3" fill="#6EE7FF" />
              <circle cx="30" cy="22" r="3" fill="#6EE7FF" />
              <rect x="20" y="28" width="8" height="2" rx="1" fill="#6EE7FF" />
              <rect x="22" y="6" width="4" height="6" rx="2" fill="url(#robotGradient)" />
              <rect x="22" y="34" width="4" height="6" rx="2" fill="url(#robotGradient)" />
            </svg>
          </motion.div>
          <motion.div
            className="robot-ring"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="message-bubble typing-indicator">
          <div className="typing-dots">
            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
            />
            <motion.span
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          <div className="typing-label">Assistant is replying…</div>
        </div>
      </div>
    </motion.div>
  )
}

export default TypingIndicator