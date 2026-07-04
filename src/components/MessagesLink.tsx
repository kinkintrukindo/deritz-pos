'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';

export function MessagesLink() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  async function loadUnreadCount() {
    try {
      const res = await fetch('/api/chat/conversations');
      if (!res.ok) return;
      const conversations = await res.json();
      const unread = conversations.filter((c: any) => !c.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }

  if (!user) return null;

  return (
    <Link href="/messages" className="relative group">
      <svg className="w-5 h-5 text-graphite group-hover:text-ink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-gold text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
