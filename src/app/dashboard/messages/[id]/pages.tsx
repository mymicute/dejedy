'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ChatPage() {
  const messages = [
    {
      id: 1,
      sender: 'agent',
      text: 'Hello! Are you interested in the Lekki apartment?',
      time: '10:30 AM',
    },
    {
      id: 2,
      sender: 'user',
      text: 'Yes, I am. Is it still available?',
      time: '10:31 AM',
    },
    {
      id: 3,
      sender: 'agent',
      text: 'Yes, it is. Would you like to schedule an inspection?',
      time: '10:32 AM',
    },
  ]

  return (
    <div className="flex flex-col h-[80vh]">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-3 mb-4">
        <Link href="/dashboard/messages">
          <ArrowLeft className="h-5 w-5 text-zinc-400 hover:text-white" />
        </Link>
        <h2 className="font-semibold">Ade (Agent)</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[75%] p-3 rounded-2xl text-sm ${
              msg.sender === 'user'
                ? 'ml-auto bg-indigo-500 text-white'
                : 'bg-zinc-800 text-zinc-100'
            }`}
          >
            <p>{msg.text}</p>
            <span className="block text-[10px] mt-1 opacity-70">
              {msg.time}
            </span>
          </div>
        ))}
      </div>

      {/* INPUT (DEMO ONLY) */}
      <div className="mt-4">
        <input
          placeholder="Type a message..."
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm outline-none"
        />
      </div>
    </div>
  )
}
