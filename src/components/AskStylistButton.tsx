'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import type { Product } from '@/lib/types';

interface AskStylistButtonProps {
  product: Product;
  variant?: 'icon' | 'full';
  className?: string;
}

export function AskStylistButton({ product, variant = 'full', className = '' }: AskStylistButtonProps) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = user?.id || email;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (!user && email) {
        headers['X-Guest-Email'] = email;
      }

      // Create conversation
      const convRes = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          subject: `Question about ${product.name}`,
          productId: product.id,
          productName: product.name,
          productImage: product.image,
        }),
      });

      if (!convRes.ok) throw new Error('Failed to create conversation');
      const conversation = await convRes.json();

      // Send initial message
      await fetch(`/api/chat/conversations/${conversation.id}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: message }),
      });

      setSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setMessage('');
        setEmail('');
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!showModal) {
    if (variant === 'icon') {
      return (
        <button
          onClick={() => setShowModal(true)}
          className={`w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center hover:bg-gold transition-colors ${className}`}
          title="Ask Stylist"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      );
    }

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
      <div className="bg-white max-w-md w-full p-8 border border-mist">
        <h3 className="text-lg font-medium text-ink mb-4">Ask About This Piece</h3>

        {submitted ? (
          <div className="text-center py-8">
            <p className="text-green-600 mb-2">✓ Message sent!</p>
            <p className="text-sm text-graphite">Our stylists will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-sm font-medium text-ink mb-2">{product.name}</p>
              <p className="text-xs text-graphite">Rp {product.basePriceIdr.toLocaleString('id-ID')}</p>
            </div>

            {!user && (
              <div>
                <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-mist text-sm focus:outline-none focus:border-ink"
                  placeholder="your@email.com"
                />
              </div>
            )}

            <div>
              <label className="block text-xs tracking-wide-label uppercase text-graphite mb-2">
                Your Question
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-mist text-sm focus:outline-none focus:border-ink resize-none"
                placeholder="Ask about sizing, colors, customization, etc..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-mist text-ink hover:bg-surface transition-colors disabled:opacity-50 text-xs tracking-wide-label uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-ink text-white hover:bg-graphite transition-colors disabled:opacity-50 text-xs tracking-wide-label uppercase"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
