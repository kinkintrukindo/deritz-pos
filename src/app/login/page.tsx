'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-28">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-ink mb-2">Sign In</h1>
        <p className="text-sm text-graphite">Access your De Ritz account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label className="block text-xs tracking-wide-label uppercase text-graphite mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3 hover:bg-gold transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-graphite">
        Don't have an account?{' '}
        <Link href="/signup" className="text-ink hover:text-gold underline">
          Sign up
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-graphite">
        <Link href="/" className="hover:text-ink underline">
          Back to home
        </Link>
      </p>
    </div>
  );
}
