'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Price } from '@/components/Price';
import { getOrdersByEmailAction } from '@/app/admin/actions';
import type { Order } from '@/lib/types';

function getStatusColor(status: string) {
  switch (status) {
    case 'received':
      return 'text-blue-700 bg-blue-50';
    case 'processed':
      return 'text-amber-700 bg-amber-50';
    case 'shipped':
      return 'text-purple-700 bg-purple-50';
    case 'delivered':
      return 'text-green-700 bg-green-50';
    case 'refunded':
      return 'text-red-700 bg-red-50';
    default:
      return 'text-graphite bg-surface';
  }
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.email) {
      setIsLoading(true);
      setError('');
      getOrdersByEmailAction(user.email)
        .then((result) => {
          console.log('Orders fetched:', result);
          setOrders(result || []);
        })
        .catch((err) => {
          console.error('Failed to fetch orders:', err);
          setError(err.message);
          setOrders([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user?.email]);

  if (loading || isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 lg:px-10 py-24 text-center">
        <p className="text-graphite">Loading your orders...</p>
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded">
            <p className="text-sm">Error loading orders: {error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <p className="text-graphite text-center py-8">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-mist p-6 hover:border-ink transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs tracking-wide-label uppercase text-graphite mb-1">Order ID</p>
                    <p className="font-medium text-ink">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide-label uppercase text-graphite mb-1">Date</p>
                    <p className="text-sm text-ink">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-wide-label uppercase text-graphite mb-1">Total</p>
                    <Price amountIdr={order.totalIdr} className="font-medium text-ink" />
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
                        {item.qty}x {item.name}
                        {item.sizeMode === 'preset' ? ` — Size ${item.sizePreset}` : ' — Custom Fit'} —{' '}
                        <Price amountIdr={(item.unitPriceIdr + item.surchargeIdr) * item.qty} />
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/order-confirmation/${order.id}`}
                  className="inline-block mt-4 text-xs tracking-wide-label uppercase text-gold hover:text-ink transition-colors underline"
                >
                  View Details & Track
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
