import { useState } from 'react'
import ChatRoom from '../components/ChatRoom'

export default function Home() {
    const [chats, setChats] = useState<
        Array<{
            id: number
            title: string
            messages: Array<{ role: string; content: string }>
        }>
    >([{ id: 1, title: '새로운 채팅', messages: [] }])
    const [currentChatId, setCurrentChatId] = useState(1)

    const createNewChat = () => {
        const newChatId = chats.length + 1
        const newChat = {
            id: newChatId,
            title: `새로운 채팅 ${newChatId}`,
            messages: []
        }
        setChats([...chats, newChat])
        setCurrentChatId(newChatId)
    }

    const updateMessages = (
        chatId: number,
        newMessages: Array<{ role: string; content: string }>
    ) => {
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.id === chatId ? { ...chat, messages: newMessages } : chat
            )
        )
    }

    const currentChat = chats.find(chat => chat.id === currentChatId)

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
                <button
                    onClick={createNewChat}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-4 transition duration-200"
                >
                    + 새로운 채팅
                </button>
                <div className="space-y-2">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setCurrentChatId(chat.id)}
                            className={`p-2 hover:bg-gray-700 rounded cursor-pointer transition duration-200 ${
                                currentChatId === chat.id ? 'bg-gray-600' : ''
                            }`}
                        >
                            {chat.title}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Interface */}
            {currentChat && (
                <ChatRoom
                    chatId={currentChatId}
                    messages={currentChat.messages}
                    updateMessages={updateMessages}
                />
            )}
        </div>
    )
}
