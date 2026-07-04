'use client';

import { useState, useEffect } from 'react';
import type { ChatConversation, ChatMessage } from '@/lib/types';

interface ChatConversationProps {
  conversation: ChatConversation;
  messages: ChatMessage[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function ChatConversationComponent({
  conversation,
  messages,
  onSendMessage,
  isLoading,
}: ChatConversationProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-paper">
      {/* Header */}
      <div className="border-b border-mist p-4 bg-paper">
        <h2 className="text-lg font-medium text-ink" style={{ fontFamily: 'var(--font-trajan)' }}>
          {conversation.subject}
        </h2>
        <p className="text-xs text-graphite mt-1">
          Started {new Date(conversation.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-graphite text-sm py-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.isAdmin
                    ? 'bg-mist text-ink'
                    : 'bg-ink text-white'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.isAdmin ? 'text-graphite' : 'text-white/70'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t border-mist p-4 bg-paper">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-mist rounded text-sm focus:outline-none focus:border-ink"
            disabled={isSending || isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending || isLoading}
            className="px-4 py-2 bg-ink text-white text-xs tracking-wide-label uppercase rounded hover:bg-graphite disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
