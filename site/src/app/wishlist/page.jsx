// src/app/wishlist/page.jsx
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const queryClient = useQueryClient();

  // 1. Fetch Wishlist Data using React Query
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await fetch('/api/wishlist');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });

  // 2. Remove Mutation logic
  const removeMutation = useMutation({
    mutationFn: async (productId) => {
      const res = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      // This instantly refreshes both this page AND the Navbar badge
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (err) => {
      alert("Failed to remove item: " + err.message);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1248px] mx-auto mt-4 pb-10 px-2 sm:px-0">
      {/* Header Section */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-200 rounded-t-sm">
        <h1 className="text-[18px] font-medium text-[#212121]">
          My Wishlist <span className="text-[#878787] text-[14px] font-normal">({wishlist.length} Items)</span>
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white p-20 text-center shadow-sm rounded-b-sm border border-gray-100">
          <img 
            src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" 
            alt="Empty Wishlist" 
            className="w-[200px] mx-auto mb-6 opacity-80" 
          />
          <h2 className="text-[18px] font-medium text-[#212121]">Empty Wishlist</h2>
          <p className="text-[#878787] text-[14px] mt-2">You have no items in your wishlist. Start adding!</p>
          <Link href="/">
            <button className="mt-6 bg-[#800000] text-white px-12 py-2.5 rounded-sm font-medium shadow hover:bg-[#a30000] transition">
              Add Items
            </button>
          </Link>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-white border-l border-gray-100 shadow-sm rounded-b-sm">
          {wishlist.map((item) => (
            <div key={item.id} className="border-r border-b border-gray-100 relative group">
              <ProductCard product={item.product} />
              
              {/* Individual Remove Trigger */}
              <button 
                onClick={() => removeMutation.mutate(item.product_id)}
                disabled={removeMutation.isPending}
                title="Remove from wishlist"
                className={`absolute top-4 right-4 transition-colors z-20 ${
                    removeMutation.isPending ? 'text-gray-200' : 'text-red-500 hover:text-red-700'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}