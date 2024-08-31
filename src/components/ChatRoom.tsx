import { useState, useEffect } from 'react'
import axios from 'axios'

interface ChatRoomProps {
    chatId: number
}

export default function ChatRoom({ chatId }: ChatRoomProps) {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<
        Array<{ role: string; content: string }>
    >([])

    useEffect(() => {
        // 채팅방이 변경될 때마다 메시지 초기화
        setMessages([])
    }, [chatId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const newMessage = { role: 'user', content: input }
        setMessages(prevMessages => [...prevMessages, newMessage])

        try {
            const response = await axios.post('/api/chat', { message: input })
            const assistantMessage = {
                role: 'assistant',
                content: response.data.choices[0].message.content
            }
            setMessages(prevMessages => [...prevMessages, assistantMessage])
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
