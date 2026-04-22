'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default function MessagesPage() {
  const chats = [
    {
      id: '1',
      name: 'Ade (Agent)',
      lastMessage: 'Hello, the property is still available.',
      time: '2m ago',
      unread: true,
    },
    {
      id: '2',
      name: 'Chioma (Agent)',
      lastMessage: 'Inspection is scheduled for tomorrow.',
      time: '1h ago',
      unread: false,
    },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-zinc-500">
          Chat with agents and property owners.
        </p>
      </header>

      <div className="space-y-3">
        {chats.map(chat => (
          <Link key={chat.id} href={`/dashboard/messages/${chat.id}`}>
            <Card className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{chat.name}</p>
                  <p className="text-sm text-zinc-400">
                    {chat.lastMessage}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-xs text-zinc-500">{chat.time}</p>
                  {chat.unread && (
                    <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
