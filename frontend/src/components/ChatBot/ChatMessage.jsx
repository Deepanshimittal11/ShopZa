import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function ChatMessage({ message }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (message.sender === 'bot') {
      // If streaming, show text directly without animation
      if (message.isStreaming) {
        setDisplayedText(message.text)
        setIsAnimating(false)
        return
      }

      // If not streaming and text exists, animate it
      const text = message.text
      if (text && text !== displayedText) {
        setIsAnimating(true)
        let index = 0
        setDisplayedText('')

        const interval = setInterval(() => {
          if (index < text.length) {
            setDisplayedText(text.slice(0, index + 1))
            index++
          } else {
            clearInterval(interval)
            setIsAnimating(false)
          }
        }, 15) // Faster typing speed

        return () => clearInterval(interval)
      }
    } else {
      // For user messages, show immediately
      setDisplayedText(message.text)
      setIsAnimating(false)
    }
  }, [message.text, message.isStreaming, message.sender])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`message ${message.sender}`}
    >
      <div className="message-content">
        {message.sender === 'bot' && (
          <div className="message-avatar robot-avatar">
            <motion.div
              className="robot-head"
              animate={{ rotate: [0, -2, 2, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="robotGradientStatic" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6EE7FF" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
                <rect x="8" y="10" width="32" height="24" rx="6" fill="url(#robotGradientStatic)" />
                <rect x="12" y="14" width="24" height="16" rx="4" fill="#0B1021" />
                <circle cx="18" cy="22" r="3" fill="#6EE7FF" />
                <circle cx="30" cy="22" r="3" fill="#6EE7FF" />
                <rect x="20" y="28" width="8" height="2" rx="1" fill="#6EE7FF" />
                <rect x="22" y="6" width="4" height="6" rx="2" fill="url(#robotGradientStatic)" />
              </svg>
            </motion.div>
          </div>
        )}
        
        <div className={`message-bubble ${message.sender === 'bot' ? 'bot-bubble' : 'user-bubble'}`}>
          {message.files && message.files.length > 0 && (
            <div className="message-files">
              {message.files.map((file, index) => (
                <div key={index} className="file-attachment">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
          
          <p>
            {message.isStreaming ? message.text : displayedText}
            {(isAnimating || message.isStreaming) && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="typing-cursor"
              >
                |
              </motion.span>
            )}
          </p>
        </div>

        {message.sender === 'user' && (
          <div className="message-avatar user-avatar">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
      
      <div className="message-timestamp">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </motion.div>
  )
}

export default ChatMessage