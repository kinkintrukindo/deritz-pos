'use client';

import { useState } from 'react';

export function MessagesLink() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="relative group hover:opacity-70 transition-opacity"
        title="Messages"
      >
        <svg className="w-5 h-5 text-graphite group-hover:text-ink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPopup(false)}>
          <div className="bg-white rounded border border-mist p-8 max-w-sm text-center relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-graphite hover:text-ink transition-colors"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-medium text-ink mb-3">Live Chat Coming Soon</h2>
            <p className="text-graphite text-sm mb-6">
              We're working on a live chat feature. In the meantime, reach out to us on WhatsApp!
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-2.5 bg-ink text-white text-xs tracking-wide-label uppercase rounded hover:bg-gold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
