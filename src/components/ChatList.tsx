'use client';

import Link from 'next/link';
import type { ChatConversation } from '@/lib/types';

interface ChatListProps {
  conversations: ChatConversation[];
  activeId?: string;
  onNewConversation?: () => void;
}

export function ChatList({ conversations, activeId, onNewConversation }: ChatListProps) {
  return (
    <div className="border-r border-mist bg-surface h-full overflow-y-auto">
      <div className="p-4 border-b border-mist">
        <button
          onClick={onNewConversation}
          className="w-full px-3 py-2 bg-ink text-white text-xs tracking-wide-label uppercase rounded hover:bg-graphite transition-colors"
        >
          + New Conversation
        </button>
      </div>

      <div className="divide-y divide-mist">
        {conversations.length === 0 ? (
          <div className="p-4">
            <p className="text-sm text-graphite text-center">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/messages/${conv.id}`}
              className={`block p-4 hover:bg-paper transition-colors border-l-4 ${
                activeId === conv.id ? 'border-ink bg-paper' : 'border-transparent'
              }`}
            >
              <h3 className="font-medium text-sm text-ink truncate">{conv.subject}</h3>
              <p className="text-xs text-graphite mt-1">
                {new Date(conv.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
