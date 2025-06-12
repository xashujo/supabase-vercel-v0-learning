'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Page() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error('Error fetching messages:', error)
      else setMessages(data)
    }

    fetchMessages()
  }, [])

  return (
    <main>
      <h1>Messages</h1>
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
