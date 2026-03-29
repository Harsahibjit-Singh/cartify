// src/app/cart/page.jsx
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Fetch Cart Items with useQuery
  const { data: cartItems = [], isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch('/api/cart');
      const json = await res.json();
      if (res.status === 401) {
        router.push('/login?redirect=/cart');
        return [];
      }
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });

  // 2. Mutation for Quantity Change
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, change }) => {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: change }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // 3. Mutation for Removing Item
  const removeItemMutation = useMutation({
    mutationFn: async (cartItemId) => {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalOriginalPrice = cartItems.reduce((acc, item) => acc + (item.product.original_price * item.quantity), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  if (cartItems.length === 0) {
    return (
      <div className="bg-white max-w-[1248px] mx-auto mt-4 mb-10 min-h-[60vh] flex flex-col items-center justify-center shadow-sm rounded-sm">
        <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="w-[250px] mb-6" />
        <h2 className="text-[18px] text-[#212121] mb-2">Your cart is empty!</h2>
        <p className="text-[14px] text-[#878787] mb-6">Add items to it now.</p>
        <Link href="/">
          <button className="bg-[#800000] text-white px-16 py-3 rounded-sm shadow text-[14px] font-medium hover:bg-[#a30000] transition">
            Shop Now
          </button>
        </Link>
      </div>
    );
  }

  const isUpdating = updateQuantityMutation.isPending || removeItemMutation.isPending;

  return (
    <div className={`flex flex-col lg:flex-row gap-4 max-w-[1248px] mx-auto pb-10 mt-4 px-2 sm:px-0 ${isUpdating ? 'opacity-70 pointer-events-none' : ''}`}>
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white shadow-sm rounded-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-[18px] font-medium text-[#212121]">
              Cartify ({totalItems})
            </h1>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition">
              <div className="flex flex-col items-center gap-4 w-[120px] shrink-0 mx-auto sm:mx-0">
                <div className="h-[120px] flex items-center justify-center">
                  <img src={item.product.images[0]} alt={item.product.title} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantityMutation.mutate({ productId: item.product.id, change: -1 })}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center bg-white text-xl hover:bg-gray-100 disabled:opacity-30"
                  > - </button>
                  <div className="w-10 h-7 border border-gray-300 flex items-center justify-center text-[14px] bg-white font-medium">
                    {item.quantity}
                  </div>
                  <button 
                    onClick={() => updateQuantityMutation.mutate({ productId: item.product.id, change: 1 })}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center bg-white text-xl hover:bg-gray-100"
                  > + </button>
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <Link href={`/product/${item.product.id}`} className="text-[16px] text-[#212121] hover:text-[#800000] font-medium mb-1 transition-colors">
                  {item.product.title}
                </Link>
                <div className="text-[14px] text-[#878787] mb-3 capitalize">{item.product.category}</div>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-[14px] text-[#878787] line-through">₹{item.product.original_price.toLocaleString('en-IN')}</span>
                  <span className="text-[18px] font-medium text-[#212121]">₹{item.product.price.toLocaleString('en-IN')}</span>
                  <span className="text-[14px] font-medium text-[#388e3c]">
                    {Math.round(((item.product.original_price - item.product.price) / item.product.original_price) * 100)}% Off
                  </span>
                </div>
                <div className="mt-auto">
                  <button 
                    onClick={() => removeItemMutation.mutate(item.id)}
                    className="text-[16px] font-medium text-[#212121] hover:text-[#800000] uppercase tracking-wide transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="px-6 py-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-end sticky bottom-0 z-10 rounded-b-sm">
            <button 
              onClick={() => router.push('/checkout')}
              className="bg-[#fb641b] text-white px-12 py-4 rounded-sm font-medium text-[16px] uppercase shadow hover:bg-[#f05c13] transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* PRICE DETAILS SECTION */}
      <div className="w-full lg:w-[350px]">
        <div className="bg-white shadow-sm rounded-sm sticky top-[80px]">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-[16px] font-medium text-[#878787] uppercase tracking-wide">Price Details</h2>
          </div>
          <div className="p-6 flex flex-col gap-4 text-[16px] text-[#212121]">
            <div className="flex justify-between">
              <span>Price ({totalItems} items)</span>
              <span>₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-[#388e3c]">- ₹{totalDiscount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-[#388e3c]">Free</span>
            </div>
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            <div className="flex justify-between text-[18px] font-medium">
              <span>Total Amount</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            <div className="text-[16px] font-medium text-[#388e3c]">
              You will save ₹{totalDiscount.toLocaleString('en-IN')} on this order
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}