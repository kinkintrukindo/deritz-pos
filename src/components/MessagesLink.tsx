'use client';

import { useState } from 'react';

export function MessagesLink() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative group hover:opacity-70 transition-opacity"
        title="Messages"
      >
        <svg className="w-5 h-5 text-graphite group-hover:text-ink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 pt-20"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-medium text-ink">Live Chat Coming Soon</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-graphite hover:text-ink transition-colors flex-shrink-0 ml-4"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-graphite text-sm mb-6">
              We're working on a live chat feature. In the meantime, reach out to us on WhatsApp!
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2.5 bg-ink text-white text-xs tracking-wide-label uppercase rounded hover:bg-gold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
