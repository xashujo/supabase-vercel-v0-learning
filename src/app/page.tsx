// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Page() {
  // 1. --- STATE HOOKS ---
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  // 2. --- FUNCTION DECLARATIONS ---
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching messages:', error)
    else setMessages(data)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) console.error('Error signing up:', error)
    else console.log('Signup successful! Check your email to confirm.')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) console.error('Error logging in:', error)
    else {
      console.log('Login successful:', data)
      setUser(data.user)
    }
  }

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim().length === 0) return

    const { data, error, status } = await supabase.from('messages').insert([
      {
        content: newMessage,
        user_id: user?.id,
      },
    ])

    if (error || status >= 400) {
      console.error('Error adding message:', { error, status, data })
    } else {
      setNewMessage('')
      fetchMessages()
    }
  }

  // 3. --- EFFECTS ---
  useEffect(() => {
    fetchMessages()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  // 4. --- CONDITIONAL RETURN (login form) ---
  if (!user) {
    return (
      <main>
        <h1>Login or Signup</h1>
        <form>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', marginBottom: '10px' }}
          />
          <button onClick={handleLogin} style={{ marginRight: '10px' }}>
            Login
          </button>
          <button onClick={handleSignup}>Sign Up</button>
        </form>
      </main>
    )
  }

  // 5. --- MAIN RETURN (authenticated user) ---
  return (
    <main>
      <h1>Messages</h1>
      <form onSubmit={handleAddMessage} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message"
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Add Message</button>
      </form>

      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            {msg.content} (User: {msg.user_id})
          </li>
        ))}
      </ul>
    </main>
  )
}
