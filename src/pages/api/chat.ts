import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const { message } = req.body
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant.'
                        },
                        { role: 'user', content: message }
                    ],
                    model: 'gpt-3.5-turbo'
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            res.status(200).json(response.data)
        } catch (error) {
            res.status(500).json({ error: 'Error processing your request' })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
