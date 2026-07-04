'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Price } from '@/components/Price';

// Mock orders data - replace with actual backend call
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    date: '2026-06-15',
    total: 7500000,
    status: 'paid',
    items: [{ name: 'Look 2', qty: 1, price: 7500000 }],
  },
  {
    id: 'ORD-002',
    date: '2026-05-20',
    total: 5500000,
    status: 'paid',
    items: [{ name: 'Cream Botanical Batik Kebaya', qty: 1, price: 5500000 }],
  },
  {
    id: 'ORD-003',
    date: '2026-04-10',
    total: 10000000,
    status: 'processing',
    items: [{ name: 'Rose Gold Embellished Kebaya', qty: 1, price: 10000000 }],
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'paid':
      return 'text-green-700 bg-green-50';
    case 'processing':
      return 'text-amber-700 bg-amber-50';
    case 'pending':
      return 'text-blue-700 bg-blue-50';
    case 'cancelled':
      return 'text-red-700 bg-red-50';
    default:
      return 'text-graphite bg-surface';
  }
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 lg:px-10 py-24 text-center">
        <p className="text-graphite">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-10 py-16">
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/account/profile"
          className="text-lg font-medium text-graphite hover:text-ink transition-colors"
        >
          Profile
        </Link>
        <span className="text-graphite">/</span>
        <Link
          href="/account/orders"
          className="text-lg font-medium text-ink hover:text-gold transition-colors"
        >
          Orders
        </Link>
      </div>

      <div className="border border-mist p-8">
        <h1 className="text-3xl font-medium tracking-tight text-ink mb-8">Your Orders</h1>

        {MOCK_ORDERS.length === 0 ? (
          <p className="text-graphite text-center py-8">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="border border-mist p-6 hover:border-ink transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs tracking-wide-label uppercase text-graphite mb-1">Order ID</p>
                    <p className="font-medium text-ink">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide-label uppercase text-graphite mb-1">Date</p>
                    <p className="text-sm text-ink">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide-label uppercase text-graphite mb-1">Total</p>
                    <Price amountIdr={order.total} className="font-medium text-ink" />
                  </div>
                  <div>
                    <p className="text-xs tracking-wide-label uppercase text-graphite mb-1">Status</p>
                    <span className={`inline-block px-2.5 py-1 text-xs tracking-wide-label uppercase rounded ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-mist pt-4">
                  <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">Items</p>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-graphite">
                        {item.qty}x {item.name} —{' '}
                        <Price amountIdr={item.price} />
                      </li>
                    ))}
                  </ul>
                </div>

                {order.status === 'paid' && (
                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="inline-block mt-4 text-xs tracking-wide-label uppercase text-gold hover:text-ink transition-colors underline"
                  >
                    View Details
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
