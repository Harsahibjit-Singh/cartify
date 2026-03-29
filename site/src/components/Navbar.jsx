// src/components/Navbar.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Side Navbar State

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

  // 2. Fetch Cart Count
  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch('/api/cart');
      const json = await res.json();
      return json.data || [];
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsSidebarOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      {/* SIDE NAVBAR (SIDEBAR) */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isSidebarOpen ? 'bg-black/50 opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div 
          className={`absolute top-0 left-0 h-full w-[280px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
        >
          {/* Sidebar Header */}
          <div className="bg-[#800000] p-4 flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-medium leading-tight">
                {user ? `Hello, ${user.name.split(' ')[0]}` : 'Login & Get Started'}
              </span>
            </div>
          </div>

          {/* Sidebar Links */}
          <div className="flex flex-col py-2">
            <Link href="/" onClick={() => setIsSidebarOpen(false)} className="px-6 py-3 text-[14px] text-[#212121] flex items-center gap-4 hover:bg-gray-50">
              <span>🏠</span> Home
            </Link>
            
            {user && (
              <>
                <Link href="/orders" onClick={() => setIsSidebarOpen(false)} className="px-6 py-3 text-[14px] text-[#212121] flex items-center gap-4 hover:bg-gray-50">
                  <span>📦</span> My Orders
                </Link>
                <Link href="/wishlist" onClick={() => setIsSidebarOpen(false)} className="px-6 py-3 text-[14px] text-[#212121] flex items-center gap-4 hover:bg-gray-50">
                  <span>❤️</span> My Wishlist
                </Link>
                <div className="border-t border-gray-100 my-2"></div>
                <div onClick={handleLogout} className="px-6 py-3 text-[14px] text-[#212121] flex items-center gap-4 hover:bg-gray-50 cursor-pointer">
                  <span>🚪</span> Logout
                </div>
              </>
            )}

            {!user && (
              <Link href="/login" onClick={() => setIsSidebarOpen(false)} className="px-6 py-3 text-[14px] text-[#212121] flex items-center gap-4 hover:bg-gray-50">
                <span>🔑</span> Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-[#800000] sticky top-0 z-50 shadow-md">
        <div className="max-w-[1248px] mx-auto px-4 sm:px-12 flex flex-col md:flex-row items-center justify-between min-h-[56px] py-2 md:py-0 gap-2 md:gap-0">
          
          <div className="flex items-center justify-between w-full md:w-auto flex-1 gap-4 lg:gap-8">
            
            <div className="flex items-center gap-3">
              {/* HAMBURGER MENU BUTTON (Visible on Mobile) */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-white p-1"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>

              <Link href="/" className="flex flex-col items-center cursor-pointer min-w-max">
                <span className="text-white text-xl font-bold italic tracking-wider">Cartify</span>
                <span className="text-white text-[11px] italic flex items-center">
                  Discover <span className="text-[#ffe500] font-bold ml-1">Elite</span>
                </span>
              </Link>
            </div>

            {/* DESKTOP SEARCH BAR */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex relative w-full max-w-[550px]">
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products, brands and more" 
                className="w-full py-2 pl-4 pr-12 rounded-sm text-sm outline-none bg-[#5c2323] text-white placeholder-gray-300" 
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white opacity-80 hover:opacity-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </button>
            </form>

            {/* Mobile Actions: Cart Only (Login is in Sidebar) */}
            <div className="flex md:hidden items-center gap-4">
              <Link href="/cart" className="flex items-center text-white cursor-pointer relative">
                <svg width="22" height="22" viewBox="0 0 16 16" fill="white"><path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86" /></svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff9f00] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#800000]">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="md:hidden relative w-full mt-2 mb-1">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products, brands and more" 
              className="w-full py-2 pl-4 pr-10 rounded-sm text-sm outline-none bg-[#660000] text-white placeholder-gray-300" 
            />
            <button type="submit" className="absolute right-0 top-0 h-full px-3">
              <svg width="20" height="20" viewBox="0 0 17 18" fill="white"><path d="M11.618 9.897l4.224 4.212c.092.09.1.23.02.313l-1.464 1.46c-.08.08-.222.072-.314-.02L9.86 11.64c-1.213.913-2.712 1.46-4.322 1.46-4.008 0-7.258-3.25-7.258-7.258C-1.72 1.832 1.53 1.42 5.538 1.42c4.01 0 7.258 3.25 7.258 7.258 0 1.61-.546 3.11-1.46 4.323zm-6.08.102c2.894 0 5.238-2.345 5.238-5.24 0-2.895-2.344-5.24-5.238-5.24-2.895 0-5.238 2.345-5.238 5.24 0 2.895 2.343 5.24 5.238 5.24z" /></svg>
            </button>
          </form>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-6 md:gap-8 ml-6">
            {user ? (
              <div className="relative group cursor-pointer">
                <div className="text-white font-medium text-[15px] flex items-center gap-1 py-4">
                  {user.name.split(' ')[0]}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="group-hover:rotate-180 transition-transform"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>
                </div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[240px] bg-white shadow-lg rounded-sm flex flex-col hidden group-hover:flex z-50 border border-gray-100">
                  <Link href="/orders" className="px-4 py-3 text-[14px] text-[#212121] hover:bg-gray-50 flex items-center gap-3">📦 Orders</Link>
                  <Link href="/wishlist" className="px-4 py-3 text-[14px] text-[#212121] hover:bg-gray-50 flex items-center gap-3">❤️ Wishlist</Link>
                  <div onClick={handleLogout} className="px-4 py-3 text-[14px] text-[#212121] hover:bg-gray-50 flex items-center gap-3 cursor-pointer">🚪 Logout</div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-white text-[#800000] px-8 py-1 font-medium rounded-sm border border-gray-200 shadow-sm hover:bg-gray-50">Login</Link>
            )}

            <Link href="/cart" className="flex items-center text-white font-medium text-[15px] cursor-pointer gap-2 relative">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86" /></svg>
              <span>Cart</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}