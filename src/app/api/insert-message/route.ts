// src/app/api/insert-message/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { content, user_id, username } = await req.json()

  const response = await fetch('https://swxgstbbcwmktpzdpsfa.functions.supabase.co/insert-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ content, user_id, username }),
  })

  const result = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: result.error || 'Edge function failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
