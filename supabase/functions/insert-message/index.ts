import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content, user_id, username } = req.body

  const supabaseEdgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/insert-message`

  const response = await fetch(supabaseEdgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ content, user_id, username }),
  })

  const data = await response.json()

  if (!response.ok) {
    return res.status(500).json({ error: data.error || 'Edge function failed' })
  }

  return res.status(200).json({ success: true })
}
