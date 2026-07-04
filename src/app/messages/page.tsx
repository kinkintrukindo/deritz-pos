'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getStoredGuestEmail, setStoredGuestEmail } from '@/lib/guest-email';
import type { ChatConversation } from '@/lib/types';
import { ChatList } from '@/components/ChatList';
import Link from 'next/link';

export default function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<{ order?: string } | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(!user && !loading);

  useEffect(() => {
    searchParams.then(setParams);
  }, [searchParams]);

  useEffect(() => {
    if (loading) return;

    if (user && params !== null) {
      loadConversations();

      // If order parameter is provided, create a new conversation
      if (params.order) {
        const subject = `Question about order ${params.order}`;
        fetch('/api/chat/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, orderId: params.order }),
        })
          .then((r) => r.json())
          .then((conv) => {
            window.history.replaceState({}, '', '/messages');
            window.location.href = `/messages/${conv.id}`;
          })
          .catch(loadConversations);
      }
    }

    if (!user) {
      const stored = getStoredGuestEmail();
      if (stored) {
        loadConversations(stored);
      } else {
        setShowGuestForm(true);
      }
    }
  }, [user, loading, params]);

  const loadConversations = async (email?: string) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (email) {
        headers['X-Guest-Email'] = email;
      }
      const response = await fetch('/api/chat/conversations', { headers });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        setShowGuestForm(false);
        if (email) {
          setStoredGuestEmail(email);
          setGuestEmail(email);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (showGuestForm && !user) {
    return (
      <div className="min-h-screen bg-paper py-12">
        <div className="mx-auto max-w-md px-6">
          <Link
            href="/"
            className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline mb-8 inline-block"
          >
            ← Back
          </Link>
          <div className="border border-mist p-8">
            <h1 className="text-2xl font-medium text-ink mb-2" style={{ fontFamily: 'var(--font-trajan)' }}>
              Message Us
            </h1>
            <p className="text-graphite text-sm mb-6">
              Chat with our team about your order or any questions
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (guestEmail.trim()) {
                  loadConversations(guestEmail);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-mist rounded text-sm focus:outline-none focus:border-ink"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-ink text-white text-xs tracking-wide-label uppercase rounded hover:bg-graphite transition-colors"
              >
                Start Chatting
              </button>
            </form>
            <div className="mt-6 pt-6 border-t border-mist">
              <p className="text-xs text-graphite">
                Already have an account?{' '}
                <Link href="/login" className="text-ink hover:text-gold font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs tracking-wide-label uppercase text-graphite hover:text-ink underline mb-4 inline-block"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-medium text-ink" style={{ fontFamily: 'var(--font-trajan)' }}>
            Messages
          </h1>
          <p className="text-graphite text-sm mt-2">Chat with the admin team about your orders</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-graphite">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-graphite mb-4">No conversations yet</p>
            <button
              onClick={() => {
                // Create new conversation
                const subject = prompt('What would you like to discuss?');
                if (subject) {
                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (!user && guestEmail) {
                    headers['X-Guest-Email'] = guestEmail;
                  }
                  fetch('/api/chat/conversations', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ subject }),
                  })
                    .then((r) => r.json())
                    .then((conv) => {
                      window.location.href = `/messages/${conv.id}`;
                    });
                }
              }}
              className="px-6 py-2 bg-ink text-white text-xs tracking-wide-label uppercase rounded hover:bg-graphite transition-colors"
            >
              Start a Conversation
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="block border border-mist p-4 hover:border-ink hover:bg-surface transition-all rounded"
              >
                <div className="flex items-start justify-between gap-4">
                  {conv.productImage && (
                    <img
                      src={conv.productImage}
                      alt={conv.productName}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`text-sm font-medium ${!conv.read ? 'font-bold text-ink' : 'text-ink'}`}>
                        {conv.subject}
                      </h3>
                      {!conv.read && (
                        <span className="inline-block w-2 h-2 bg-gold rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    {conv.productName && (
                      <p className="text-xs text-graphite mb-1">📦 {conv.productName}</p>
                    )}
                    <p className="text-xs text-graphite/60">
                      {new Date(conv.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
