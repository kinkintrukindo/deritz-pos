'use client';

import { useState, useEffect } from 'react';
import type { ChatConversation, ChatMessage } from '@/lib/types';

interface AdminMessagesClientProps {
  initialConversations: ChatConversation[];
}

export function AdminMessagesClient({ initialConversations }: AdminMessagesClientProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadMessages(convId: string) {
    try {
      const res = await fetch(`/api/chat/conversations/${convId}`);
      if (!res.ok) throw new Error('Failed to load messages');
      const data = await res.json();
      setMessages(data.messages || []);
      setSelectedConversation(data.conversation);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedConversation || !reply.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reply.trim() }),
      });

      if (!res.ok) throw new Error('Failed to send message');
      const newMessage = await res.json();

      setMessages([...messages, newMessage]);
      setReply('');

      // Update conversation in list
      setConversations(convs =>
        convs.map(c => c.id === selectedConversation.id ? { ...c, updatedAt: new Date().toISOString() } : c)
      );
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setLoading(false);
    }
  }

  async function togglePin(conv: ChatConversation) {
    try {
      const { error } = await (await fetch(`/api/admin/conversations/${conv.id}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: !conv.pinned }),
      })).json().then(res => res) || {};

      if (!error) {
        setConversations(convs =>
          convs.map(c => c.id === conv.id ? { ...c, pinned: !c.pinned } : c).sort((a, b) => {
            if (a.pinned !== b.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          })
        );
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  }

  async function archiveConversation(conv: ChatConversation) {
    try {
      const { error } = await (await fetch(`/api/admin/conversations/${conv.id}/archive`, {
        method: 'POST',
      })).json().then(res => res) || {};

      if (!error) {
        setConversations(convs => convs.filter(c => c.id !== conv.id));
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error('Error archiving:', error);
    }
  }

  async function deleteConversation(conv: ChatConversation) {
    if (!confirm('Delete this conversation permanently?')) return;

    try {
      const { error } = await (await fetch(`/api/admin/conversations/${conv.id}`, {
        method: 'DELETE',
      })).json().then(res => res) || {};

      if (!error) {
        setConversations(convs => convs.filter(c => c.id !== conv.id));
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Conversations List */}
      <div className="lg:col-span-1 border border-mist p-6 bg-paper min-h-96">
        <h2 className="font-medium text-ink mb-4">Conversations ({conversations.length})</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-sm text-graphite">No conversations yet</p>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => loadMessages(conv.id)}
                className={`w-full text-left p-3 border transition-all ${
                  selectedConversation?.id === conv.id
                    ? 'border-ink bg-surface'
                    : 'border-mist hover:border-graphite'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className={`text-xs font-medium ${!conv.read ? 'text-ink font-bold' : 'text-graphite'}`}>
                    {conv.subject}
                  </p>
                  {conv.pinned && <span className="text-xs">📌</span>}
                  {!conv.read && <span className="inline-block w-2 h-2 bg-gold rounded-full ml-1 mt-1" />}
                </div>
                {conv.productName && (
                  <p className="text-xs text-graphite mb-1 truncate">📦 {conv.productName}</p>
                )}
                <p className="text-xs text-graphite/60">
                  {new Date(conv.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="lg:col-span-2 border border-mist p-6 bg-paper min-h-96 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="border-b border-mist pb-4 mb-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-ink">{selectedConversation.subject}</h3>
                  {selectedConversation.productImage && selectedConversation.productName && (
                    <div className="flex gap-2 mt-2 p-2 bg-surface rounded">
                      <img
                        src={selectedConversation.productImage}
                        alt={selectedConversation.productName}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-ink">{selectedConversation.productName}</p>
                        <p className="text-xs text-graphite">Product inquiry</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => togglePin(selectedConversation)}
                    title={selectedConversation.pinned ? 'Unpin' : 'Pin'}
                    className="p-1 hover:bg-surface transition-colors"
                  >
                    {selectedConversation.pinned ? '📌' : '📍'}
                  </button>
                  <button
                    onClick={() => archiveConversation(selectedConversation)}
                    title="Archive"
                    className="p-1 hover:bg-surface transition-colors text-graphite hover:text-ink"
                  >
                    🗂️
                  </button>
                  <button
                    onClick={() => deleteConversation(selectedConversation)}
                    title="Delete"
                    className="p-1 hover:bg-surface transition-colors text-graphite hover:text-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-64">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-3 rounded text-sm ${
                    msg.isAdmin
                      ? 'bg-gold/20 text-ink border-l-2 border-gold'
                      : 'bg-surface text-graphite border-l-2 border-graphite'
                  }`}
                >
                  <p className="font-medium text-xs mb-1">
                    {msg.isAdmin ? '💼 You' : '👤 Customer'}
                  </p>
                  <p className="text-xs mb-1">{msg.content}</p>
                  <p className="text-xs opacity-60">
                    {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="border-t border-mist pt-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
                className="w-full px-3 py-2 border border-mist text-sm focus:outline-none focus:border-ink resize-none mb-2"
              />
              <button
                type="submit"
                disabled={loading || !reply.trim()}
                className="w-full px-4 py-2 bg-ink text-white text-xs tracking-wide-label uppercase hover:bg-graphite transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reply'}
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center text-graphite">
            <p>Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
