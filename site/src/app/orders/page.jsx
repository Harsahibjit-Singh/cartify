"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders/history')
      .then(res => res.json())
      .then(json => {
        if (json.success) setOrders(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1248px] mx-auto p-4 md:py-8">
      <h1 className="text-[18px] font-medium text-[#212121] mb-4">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Link href="/" className="text-[#2874f0] font-medium mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-sm p-4 md:p-6 hover:shadow-md transition flex flex-col md:flex-row gap-6">
              
              {/* Product Info (Showing first item from order for preview) */}
              <div className="flex gap-4 flex-1">
                <div className="w-20 h-20 shrink-0 border border-gray-100 p-1">
                  <img 
                    src={order.order_items[0]?.products?.images[0]} 
                    alt="product" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Link href={`/orders/${order.id}`} className="text-[14px] text-[#212121] hover:text-[#2874f0] font-medium">
                    Order ID: {order.id.slice(0, 8)}...
                  </Link>
                  <p className="text-[12px] text-gray-500">
                    Placed on: {new Date(order.created_at).toDateString()}
                  </p>
                  <p className="text-[14px] font-bold mt-1 text-[#212121]">
                    ₹{order.total_amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Status Section */}
              <div className="flex flex-col gap-2 w-full md:w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#388e3c]"></div>
                  <span className="text-[14px] font-medium text-[#212121]">
                    {order.status || 'Confirmed'}
                  </span>
                </div>
                <p className="text-[12px] text-gray-500">Your item has been {order.status?.toLowerCase() || 'processed'}.</p>
              </div>

              {/* Action Options */}
              <div className="flex flex-col gap-3 w-full md:w-[150px] text-right">
                <button className="text-[#2874f0] text-[14px] font-medium flex items-center justify-end gap-1 hover:underline">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  Need Help?
                </button>
                <button className="text-[#2874f0] text-[14px] font-medium flex items-center justify-end gap-1 hover:underline">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}