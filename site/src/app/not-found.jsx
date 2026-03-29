// src/app/not-found.jsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Start countdown for redirect
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Auto-redirect to home after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f1f3f6] px-4">
      <div className="bg-white p-10 shadow-sm rounded-sm text-center max-w-lg w-full border border-gray-100">
        {/* Placeholder Illustration */}
        <img 
          src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" 
          alt="Page Not Found" 
          className="w-48 mx-auto mb-6 opacity-80"
        />
        
        <h1 className="text-[20px] font-medium text-[#212121] mb-2">
          Unfortunately the page you are looking for is not available
        </h1>
        
        <p className="text-[#878787] text-[14px] mb-8">
          The link you followed may be broken, or the page may have been removed. 
          Redirecting to Home in <span className="font-bold text-[#800000]">{countdown}s</span>...
        </p>

        <Link href="/">
          <button className="bg-[#800000] text-white px-12 py-2.5 rounded-sm font-medium shadow-sm hover:bg-[#a30000] transition uppercase text-[14px]">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
}