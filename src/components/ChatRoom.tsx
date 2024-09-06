import { useState } from 'react'
import axios from 'axios'

interface ChatRoomProps {
    chatId: number
    messages: Array<{ role: string; content: string }>
    updateMessages: (
        chatId: number,
        newMessages: Array<{ role: string; content: string }>
    ) => void
}

export default function ChatRoom({
    chatId,
    messages,
    updateMessages
}: ChatRoomProps) {
    const [input, setInput] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const newMessage = { role: 'user', content: input }
        const updatedMessages = [...messages, newMessage]
        updateMessages(chatId, updatedMessages)

        try {
            const response = await axios.post('/api/chat', { message: input })
            const assistantMessage = {
                role: 'assistant',
                content: response.data.choices[0].message.content
            }
            updateMessages(chatId, [...updatedMessages, assistantMessage])
        } catch (error) {
            console.error('Error:', error)
        }

        setInput('')
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg ${
                            message.role === 'user'
                                ? 'bg-blue-500 text-white ml-auto'
                                : 'bg-gray-300 text-black'
                        } max-w-md`}
                    >
                        {message.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="flex-grow mr-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="메시지를 입력하세요..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-200"
                    >
                        전송
                    </button>
                </div>
            </form>
        </div>
    )
}
