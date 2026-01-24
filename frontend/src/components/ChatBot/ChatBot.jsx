import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FileUploader from './FileUploader'
import VoiceToText from './VoiceToText'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'
import { getOpenRouterResponse } from '../../services/openrouterService'
import './ChatBot.css'

function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you with your shopping today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with welcome message if no messages exist
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your AI assistant. How can I help you with your shopping today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ])
    }
  }, [isOpen, messages.length])

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "Hello! I'm your AI assistant. How can I help you with your shopping today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ])
    setInputValue('')
    setUploadedFiles([])
    setIsTyping(false)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      files: [...uploadedFiles]
    }

    setMessages(prev => [...prev, userMessage])
    const userInput = inputValue
    const userFiles = [...uploadedFiles]
    setInputValue('')
    setUploadedFiles([])
    setIsTyping(true)

    // Create a placeholder bot message for streaming
    const botMessageId = Date.now() + 1
    const botMessage = {
      id: botMessageId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: true
    }

    setMessages(prev => [...prev, botMessage])

    try {
      // Get chat history (excluding the current user message and bot placeholder)
      const chatHistory = messages.filter(msg => msg.id !== botMessageId)

      // Call OpenRouter API with streaming
      await getOpenRouterResponse(
        userInput,
        userFiles,
        chatHistory,
        (streamedText) => {
          // Update the bot message with streamed text
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: streamedText }
              : msg
          ))
        }
      )

      // Mark streaming as complete
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { ...msg, isStreaming: false }
          : msg
      ))
    } catch (error) {
      // Handle error
      const errorMessage = {
        id: botMessageId,
        text: `Sorry, I encountered an error: ${error.message}. Please make sure your OpenRouter API key is configured correctly in the .env file and restart your dev server.`,
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: false
      }
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? errorMessage : msg
      ))
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="chatbot-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="chatbot-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chatbot-header">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="header-content"
          >
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>AI Shopping Assistant</h1>
            <div className="header-buttons">
              <button className="new-chat-button" onClick={startNewChat} title="Start New Chat">
                New Chat
              </button>
              <button className="close-button" onClick={onClose}>
                ×
              </button>
            </div>
          </motion.div>
        </div>

        <div className="chatbot-messages">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-container">
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="uploaded-files-preview"
            >
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="file-preview-item"
                >
                  <span className="file-name">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="remove-file-btn"
                    aria-label="Remove file"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <div className="input-wrapper">
            <FileUploader onFileUpload={handleFileUpload} />
            <VoiceToText onTranscript={(text, isFinal) => {
              if (isFinal) {
                setInputValue(prev => prev ? prev + ' ' + text : text)
              }
            }} />
            
            <textarea
              ref={inputRef}
              className="chatbot-input"
              placeholder="Ask me about products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && uploadedFiles.length === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ChatBot