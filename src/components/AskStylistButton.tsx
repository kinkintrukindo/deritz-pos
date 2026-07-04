'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import type { Product, ChatConversation, ChatMessage } from '@/lib/types';

interface AskStylistButtonProps {
  product: Product;
  className?: string;
}

export function AskStylistButton({ product, className = '' }: AskStylistButtonProps) {
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Load existing conversation if user is logged in
  useEffect(() => {
    if (user && showModal) {
      loadUserConversation();
    }
  }, [user, showModal]);

  async function loadUserConversation() {
    try {
      const res = await fetch('/api/chat/conversations');
      if (!res.ok) return;
      const conversations = await res.json();

      // Find conversation for this product by current user
      const existing = conversations.find(
        (c: ChatConversation) => c.productId === product.id && c.userId === user?.id
      );

      if (existing) {
        setConversation(existing);
        // Load messages
        const messagesRes = await fetch(`/api/chat/conversations/${existing.id}`);
        if (messagesRes.ok) {
          const data = await messagesRes.json();
          setMessages(data.messages || []);
        }
      } else {
        // Create new conversation
        const newConv = await fetch('/api/chat/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: `Question about ${product.name}`,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
          }),
        }).then(r => r.json());
        setConversation(newConv);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }

  async function createGuestConversation() {
    if (!guestEmail.trim()) {
      alert('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Guest-Email': guestEmail,
      };

      const newConv = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          subject: `Question about ${product.name}`,
          productId: product.id,
          productName: product.name,
          productImage: product.image,
        }),
      }).then(r => r.json());

      setConversation(newConv);
      setShowGuestForm(false);
      setMessages([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to start chat');
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!conversation || !newMessage.trim()) return;

    setLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (!user && guestEmail) {
        headers['X-Guest-Email'] = guestEmail;
      }

      const msg = await fetch(`/api/chat/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: newMessage.trim() }),
      }).then(r => r.json());

      setMessages([...messages, msg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <button disabled className="text-xs tracking-wide-label uppercase px-4 py-2.5 border border-mist text-graphite opacity-50">
        Loading...
      </button>
    );
  }

  if (!showModal) {
    return (
      <button
        onClick={() => setShowModal(true)}
        className={`text-xs tracking-wide-label uppercase px-4 py-2.5 border border-ink text-ink hover:bg-ink hover:text-white transition-colors ${className}`}
      >
        Ask Stylist
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md h-[600px] border border-mist flex flex-col rounded">
        {/* Header */}
        <div className="border-b border-mist p-4 flex items-center justify-between bg-ink text-white">
          <div>
            <h3 className="font-medium text-sm">De Ritz Stylist</h3>
            <p className="text-xs opacity-80">{product.name}</p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-xl hover:opacity-70"
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        {conversation ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-graphite text-sm py-8">
                  <p className="mb-2">👋 Start a conversation</p>
                  <p className="text-xs">Ask about sizing, colors, or customization</p>
                </div>
              )}
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.isAdmin
                        ? 'bg-surface text-ink rounded-br-none'
                        : 'bg-ink text-white rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.isAdmin ? 'text-graphite' : 'text-white/60'}`}>
                      {(() => {
                        try {
                          const date = new Date(msg.createdAt);
                          if (isNaN(date.getTime())) return '...';
                          return date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                        } catch {
                          return '...';
                        }
                      })()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="border-t border-mist p-3 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type message..."
                className="flex-1 px-3 py-2 border border-mist text-sm focus:outline-none focus:border-ink rounded"
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="px-3 py-2 bg-ink text-white text-sm rounded hover:bg-gold transition-colors disabled:opacity-50"
              >
                {loading ? '...' : '→'}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Guest Entry Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              {!showGuestForm ? (
                <div className="text-center space-y-4">
                  {user ? (
                    <>
                      <p className="text-sm text-graphite">Loading your chat...</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-ink font-medium">Chat with our stylists</p>
                      <p className="text-xs text-graphite mb-4">Enter your email to start</p>
                      <button
                        onClick={() => setShowGuestForm(true)}
                        className="px-4 py-2 bg-ink text-white text-xs tracking-wide-label uppercase hover:bg-gold transition-colors"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div>
                    <label className="block text-xs text-graphite mb-2">Your Email</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full px-3 py-2 border border-mist text-sm focus:outline-none focus:border-ink"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowGuestForm(false)}
                      className="flex-1 px-3 py-2 border border-mist text-sm hover:bg-surface transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={createGuestConversation}
                      disabled={loading}
                      className="flex-1 px-3 py-2 bg-ink text-white text-sm hover:bg-gold transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Chat'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
