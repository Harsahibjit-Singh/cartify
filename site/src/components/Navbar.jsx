// src/components/Navbar.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  
  // Search State
  const [searchInput, setSearchInput] = useState('');

  // 1. Fetch User Session
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        if (json.success) setUser(json.user);
      } catch (error) {
        console.error("Not logged in");
      }
    };
    checkUser();
  }, []);

  // 2. Fetch Cart Count using React Query
  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch('/api/cart');
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!user,
  });

  // 3. Fetch Wishlist Count
  const { data: wishlistItems = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await fetch('/api/wishlist');
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // HANDLE SEARCH SUBMIT
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Redirect to home page with the search query in the URL
      router.push(`/?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      // If empty, just go home
      router.push('/');
    }
  };

  return (
    <nav className="bg-[#800000] sticky top-0 z-50 shadow-md">
      <div className="max-w-[1248px] mx-auto px-4 sm:px-12 flex flex-col md:flex-row items-center justify-between min-h-[56px] py-2 md:py-0 gap-2 md:gap-0">
        
        {/* Top Row for Mobile (Logo & Cart) / Left Section for Desktop */}
        <div className="flex items-center justify-between w-full md:w-auto flex-1 gap-4 lg:gap-8">
          
          <Link href="/" className="flex flex-col items-center cursor-pointer min-w-max">
            <span className="text-white text-xl font-bold italic tracking-wider">Cartify</span>
            <span className="text-white text-[11px] italic flex items-center hover:underline">
              Discover <span className="text-[#ffe500] font-bold ml-1">Elite</span>
              <svg width="10" height="10" viewBox="0 0 20 20" className="ml-[2px]" fill="#ffe500"><path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" /></svg>
            </span>
          </Link>

          {/* DESKTOP SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative w-full max-w-[550px]">
  <input 
    type="text" 
    value={searchInput}
    onChange={(e) => setSearchInput(e.target.value)}
    placeholder="Search for products, brands and more" 
    className="w-full py-2 pl-4 pr-12 rounded-sm text-sm outline-none shadow-sm bg-[#5c2323] text-white placeholder-gray-300" 
  />

  <button 
    type="submit" 
    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center p-1.5 text-white opacity-80 hover:opacity-100"
  >
 <svg 
  className="w-5 h-5 text-white" 
  fill="none" 
  stroke="currentColor" 
  strokeWidth="2" 
  viewBox="0 0 24 24"
>
  <circle cx="11" cy="11" r="8" />
  <line x1="21" y1="21" x2="16.65" y2="16.65" />
</svg>
  </button>
</form>

          {/* Mobile Only: Cart/Login links (Moved to top row for space) */}
          <div className="flex md:hidden items-center gap-4">
            {!user && (
              <Link href="/login" className="text-white text-sm font-medium">Login</Link>
            )}
            <Link href="/cart" className="flex items-center text-white cursor-pointer relative">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="white"><path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86" /></svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff9f00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#800000]">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH BAR (Shows underneath logo on small screens) */}
        <form onSubmit={handleSearchSubmit} className="md:hidden relative w-full mt-2 mb-1">
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for products, brands and more" 
            className="w-full py-2 pl-4 pr-10 rounded-sm text-sm outline-none shadow-sm bg-[#660000] text-white placeholder-gray-300" 
          />
          <button type="submit" className="absolute right-0 top-0 h-full px-3 hover:bg-[#5c0000] transition-colors rounded-r-sm">
            <svg width="20" height="20" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.618 9.897l4.224 4.212c.092.09.1.23.02.313l-1.464 1.46c-.08.08-.222.072-.314-.02L9.86 11.64c-1.213.913-2.712 1.46-4.322 1.46-4.008 0-7.258-3.25-7.258-7.258C-1.72 1.832 1.53 1.42 5.538 1.42c4.01 0 7.258 3.25 7.258 7.258 0 1.61-.546 3.11-1.46 4.323zm-6.08.102c2.894 0 5.238-2.345 5.238-5.24 0-2.895-2.344-5.24-5.238-5.24-2.895 0-5.238 2.345-5.238 5.24 0 2.895 2.343 5.24 5.238 5.24z" fill="white" /></svg>
          </button>
        </form>

        {/* Right Section: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 md:gap-8 ml-6">
          
          {user ? (
            <div className="relative group cursor-pointer">
              <div className="text-white font-medium text-[15px] flex items-center gap-1 py-4">
                {user.name.split(' ')[0]}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="group-hover:rotate-180 transition-transform"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>
              </div>
              
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[240px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] rounded-sm flex flex-col hidden group-hover:flex z-50 border border-gray-100">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-solid border-b-white border-b-8 border-x-transparent border-x-8 border-t-0"></div>
                
                <Link href="/orders" className="px-4 py-3 text-[14px] font-medium text-[#212121] hover:bg-gray-50 hover:text-[#800000] flex items-center gap-3 border-b border-gray-100">
                  <span className="text-[#800000]">📦</span> Orders
                </Link>
                <Link href="/wishlist" className="px-4 py-3 text-[14px] font-medium text-[#212121] hover:bg-gray-50 hover:text-[#800000] flex items-center gap-3 border-b border-gray-100 relative">
                  <span className="text-[#800000]">❤️</span> Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
                <div onClick={handleLogout} className="px-4 py-3 text-[14px] font-medium text-[#212121] hover:bg-gray-50 hover:text-[#800000] flex items-center gap-3 cursor-pointer">
                  <span className="text-[#800000]">🚪</span> Logout
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-white text-[#800000] px-8 py-1 font-medium rounded-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition">
                Login
              </button>
            </Link>
          )}

          <span className="text-white font-medium text-[15px] cursor-pointer">Become a Seller</span>

          <div className="text-white font-medium text-[15px] flex items-center cursor-pointer gap-1 group py-4">
            More
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="group-hover:rotate-180 transition-transform"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>
          </div>

          <Link href="/cart" className="flex items-center text-white font-medium text-[15px] cursor-pointer gap-2 relative">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86" /></svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff9f00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#800000]">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}