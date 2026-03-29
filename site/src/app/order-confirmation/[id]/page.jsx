// src/app/order-confirmation/[id]/page.jsx
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  // Extract the dynamically generated order ID from the URL
  const params = useParams();
  const { id } = params;

  return (
    <div className="max-w-[1248px] mx-auto min-h-[70vh] flex items-center justify-center px-4 mt-4 mb-10">
      <div className="bg-white shadow-sm rounded-sm p-8 md:p-12 flex flex-col items-center text-center max-w-lg w-full border-t-4 border-[#800000]">
        
        {/* Animated Green Success Checkmark (Kept green for UX standard) */}
        <div className="w-20 h-20 bg-[#388e3c] rounded-full flex items-center justify-center mb-6 shadow-md">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 className="text-[24px] font-medium text-[#212121] mb-2">
          Order Placed Successfully!
        </h1>
        
        <p className="text-[16px] text-[#878787] mb-6">
          Thank you for shopping with Cartify. Your order is confirmed and will be shipped shortly.
        </p>

        {/* Order ID Display Box */}
        <div className="bg-[#fdf2f2] w-full p-4 rounded-sm mb-8 flex flex-col gap-1 border border-[#ffcdd2]">
          <span className="text-[13px] text-[#800000] uppercase font-medium tracking-wide">
            Transaction / Order ID
          </span>
          <span className="text-[16px] font-medium text-[#212121] break-all">
            {id}
          </span>
        </div>

        {/* Call to Action to keep them in the app */}
        <Link href="/">
          <button className="bg-[#800000] text-white px-12 py-3 rounded-sm font-medium text-[16px] uppercase shadow hover:bg-[#a30000] transition w-full sm:w-auto">
            Continue Shopping
          </button>
        </Link>

      </div>
    </div>
  );
}