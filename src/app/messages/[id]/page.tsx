'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import type { ChatConversation, ChatMessage } from '@/lib/types';
import { ChatConversationComponent } from '@/components/ChatConversation';

export default function ConversationPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const { user, loading } = useAuth();
  const [params, setParams] = useState<{ id: string } | null>(null);
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (loading) return;

    if ((user || guestEmail) && params) {
      loadConversation();
    }
  }, [user, loading, params, guestEmail]);

  const loadConversation = async () => {
    try {
      const headers: Record<string, string> = {};
      if (guestEmail) {
        headers['X-Guest-Email'] = guestEmail;
      }
      const response = await fetch(`/api/chat/conversations/${params!.id}`, { headers });
      if (response.ok) {
        const data = await response.json();
        setConversation(data.conversation);
        setMessages(data.messages);
        setError(null);
      } else {
        setError('Failed to load conversation');
      }
    } catch (err) {
      setError('Error loading conversation');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (guestEmail) {
        headers['X-Guest-Email'] = guestEmail;
      }
      const response = await fetch(`/api/chat/conversations/${params!.id}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages([...messages, newMessage]);
      } else {
        alert('Failed to send message');
      }
    } catch (err) {
      alert('Error sending message');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user && !guestEmail) {
    return (
      <div className="min-h-screen bg-paper py-12">
        <div className="mx-auto max-w-md px-6">
          <Link
            href="/messages"
            className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline mb-8 inline-block"
          >
            ← Back to Messages
          </Link>
          <div className="border border-mist p-8">
            <h1 className="text-2xl font-medium text-ink mb-2" style={{ fontFamily: 'var(--font-trajan)' }}>
              Enter Your Email
            </h1>
            <p className="text-graphite text-sm mb-6">
              To continue your conversation, please enter your email
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (guestEmail.trim()) {
                  loadConversation();
                }
              }}
              className="space-y-4"
            >
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-mist rounded text-sm focus:outline-none focus:border-ink"
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-ink text-white text-xs tracking-wide-label uppercase rounded hover:bg-graphite transition-colors"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <Link
            href="/messages"
            className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline mb-8 inline-block"
          >
            ← Back to Messages
          </Link>
          <div className="bg-red-50 border border-red-200 p-4 rounded text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">Loading conversation...</div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <div className="border-b border-mist p-4 flex items-center justify-between bg-paper">
          <Link
            href="/messages"
            className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline"
          >
            ← Back to Messages
          </Link>
        </div>

        {conversation && (
          <ChatConversationComponent
            conversation={conversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
