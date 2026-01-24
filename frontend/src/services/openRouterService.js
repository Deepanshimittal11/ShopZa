/**
 * OpenRouter API Service
 * OpenRouter provides access to multiple AI models through a single API
 */

// Initialize OpenRouter API
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || 
                import.meta.env.VITE_OPENROUTER_API_KEY?.trim() ||
                ''

// Debug: Log env status (only in development)
if (import.meta.env.DEV) {
  console.log('=== OpenRouter API Debug Info ===')
  console.log('API Key status:', API_KEY ? 'Found (length: ' + API_KEY.length + ')' : 'Missing')
  console.log('Environment:', import.meta.env.MODE)
  console.log('================================')
}

if (!API_KEY) {
  console.error('❌ VITE_OPENROUTER_API_KEY is not set!')
  if (import.meta.env.DEV) {
    console.error('Please add it to your .env.local file in the Frontend directory:')
    console.error('VITE_OPENROUTER_API_KEY=your_key_here')
    console.error('Then RESTART your dev server (Ctrl+C then npm run dev)')
  } else {
    console.error('🚨 PRODUCTION DEPLOYMENT ISSUE:')
    console.error('If using GitHub Pages: Chatbot will not work - switch to Vercel/Netlify')
    console.error('If using Vercel/Netlify: Set VITE_OPENROUTER_API_KEY in your hosting dashboard')
    console.error('See Frontend/DEPLOYMENT_ENV_SETUP.md for detailed instructions')
  }
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

/**
 * Get response from OpenRouter API
 * @param {string} prompt - User's message
 * @param {Array} files - Array of uploaded files
 * @param {Array} chatHistory - Previous conversation history
 * @param {Function} onStream - Callback for streaming responses
 * @returns {Promise<string>} - Full response text
 */
export async function getOpenRouterResponse(prompt, files = [], chatHistory = [], onStream = null) {
  if (!API_KEY) {
    throw new Error('OpenRouter API key is not configured. Please add VITE_OPENROUTER_API_KEY to your .env file and restart your dev server.')
  }

  // Using model from environment or default
  const modelName = import.meta.env.VITE_LLM_MODEL || 'openrouter/auto'
  
  try {
    // Build conversation history for OpenRouter format
    const messages = chatHistory
      .filter(msg => msg.text && msg.text.trim().length > 0)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))

    // Prepare the prompt with file information if any
    let fullPrompt = prompt
    if (files && files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ')
      fullPrompt = `The user has uploaded ${files.length} file(s): ${fileNames}.\n\nUser message: ${prompt}\n\nPlease respond to the user's message. Note: File content processing would require additional implementation.`
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: fullPrompt
    })

    // Prepare request body
    const requestBody = {
      model: modelName,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
    }

    // If streaming is requested
    if (onStream) {
      requestBody.stream = true

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin, // Optional: for analytics
          'X-Title': 'Chatbot App' // Optional: for analytics
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              if (content) {
                fullResponse += content
                if (onStream) {
                  onStream(fullResponse)
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      return fullResponse
    } else {
      // Non-streaming response
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Chatbot App'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    }
  } catch (error) {
    console.error('Error calling OpenRouter API:', error)
    
    // Provide helpful error messages for common issues
    if (error.message && error.message.includes('401')) {
      throw new Error('Invalid API key. Please check your OpenRouter API key in the .env file.')
    }
    
    if (error.message && error.message.includes('429')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    }

    if (error.message && error.message.includes('quota') || error.message.includes('insufficient')) {
      throw new Error('❌ Quota exceeded. Please check your OpenRouter account at https://openrouter.ai/')
    }
    
    throw new Error(`Failed to get response: ${error.message || 'Unknown error'}`)
  }
}

/**
 * Process file content (for future implementation)
 */
export async function processFilesForOpenRouter(files) {
  // TODO: Implement file processing
  return files
}