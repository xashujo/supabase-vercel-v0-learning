'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Page() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching messages:', error)
    else setMessages(data)
  }

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newMessage.trim().length === 0) return

    const { error } = await supabase.from('messages').insert([
      {
        content: newMessage,
        user_id: 'manual-test-user', // replace with real user_id after adding auth
      },
    ])

    if (error) console.error('Error adding message:', error)
    else {
      setNewMessage('')
      fetchMessages()
    }
  }

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
