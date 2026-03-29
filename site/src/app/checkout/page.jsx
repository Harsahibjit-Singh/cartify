// src/app/checkout/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [user, setUser] = useState(null);
  const [activeStep, setActiveStep] = useState(2); // Start at Step 2 since Login is Step 1
  
  // Flag to track if an order is actively succeeding
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  
  // Form State for Address
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    fullAddress: '',
    city: '',
    state: ''
  });

  // 1. Fetch Logged-in User
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        if (json.success) {
          setUser(json.user);
          // Pre-fill the name if possible
          setAddress(prev => ({ ...prev, name: json.user.name || '' }));
        } else {
          router.push('/login?redirect=/checkout');
        }
      } catch (error) {
        console.error("Not logged in");
      }
    };
    checkUser();
  }, [router]);

  // 2. Fetch Cart Items using React Query
  const { data: cartItems = [], isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await fetch('/api/cart');
      if (res.status === 401) {
        router.push('/login?redirect=/checkout');
        return [];
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });

  // Redirect back to cart if it's empty (but ignore if we just placed an order!)
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0 && !isOrderPlaced) {
      router.push('/cart');
    }
  }, [cartItems, cartLoading, router, isOrderPlaced]);

  // Handle Form Input
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Move to Step 3
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setActiveStep(3);
  };

  // Move to Step 4
  const handleSummaryContinue = () => {
    setActiveStep(4);
  };

  // 3. Place Order Mutation (Actually submits the order)
  const placeOrderMutation = useMutation({
    mutationFn: async (orderPayload) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to place order');
      return json;
    },
    onSuccess: (data) => {
      setIsOrderPlaced(true);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      router.push(`/order-confirmation/${data.orderId}`);
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    }
  });

  // Handle Final Order Submission
  const handleConfirmOrder = () => {
    const shippingAddress = `${address.name}, ${address.fullAddress}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}. Ph: ${address.phone}`;
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    placeOrderMutation.mutate({ 
      shippingAddress, 
      cartItems, 
      totalAmount,
      paymentMethod: 'COD' // Explicitly marking as Cash on Delivery
    });
  };

  if (cartLoading || !user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  // Calculate Totals
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalOriginalPrice = cartItems.reduce((acc, item) => acc + (item.product.original_price * item.quantity), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  return (
    <div className="flex flex-col lg:flex-row gap-4 max-w-[1248px] mx-auto pb-10 mt-4 px-2 sm:px-0">
      
      {/* LEFT COLUMN: Checkout Steps Accordion */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* STEP 1: Login (Always Completed) */}
        <div className="bg-white shadow-sm rounded-sm px-6 py-4 flex items-center justify-between border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-[#f1f3f6] text-[#800000] w-6 h-6 rounded-sm flex items-center justify-center font-medium text-[14px]">
              1
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[#878787] text-[14px] font-medium uppercase">Login</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#800000"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <span className="text-[#212121] text-[14px] font-medium">
                {user.name} <span className="text-[#878787] font-normal ml-2">{user.email}</span>
              </span>
            </div>
          </div>
          <button className="text-[#800000] text-[14px] font-medium uppercase border border-[#e0e0e0] px-4 py-1 rounded-sm hover:bg-gray-50">
            Change
          </button>
        </div>

        {/* STEP 2: Delivery Address */}
        <div className="bg-white shadow-sm rounded-sm border border-gray-100">
          <div className={`${activeStep === 2 ? 'bg-[#800000] text-white' : 'bg-white text-[#878787]'} px-6 py-3 flex items-center justify-between rounded-t-sm transition-colors`}>
            <div className="flex items-center gap-4">
              <div className={`${activeStep === 2 ? 'bg-white text-[#800000]' : 'bg-[#f1f3f6] text-[#800000]'} w-6 h-6 rounded-sm flex items-center justify-center font-medium text-[14px]`}>
                2
              </div>
              <div className="flex flex-col">
                <span className={`${activeStep === 2 ? 'text-white' : 'text-[#878787]'} text-[16px] font-medium uppercase`}>
                  Delivery Address
                </span>
                {activeStep > 2 && (
                  <span className="text-[#212121] text-[14px] font-medium mt-1 normal-case">
                    {address.name} <span className="font-normal">{address.fullAddress}, {address.city}</span>
                  </span>
                )}
              </div>
            </div>
            {activeStep > 2 && (
              <button onClick={() => setActiveStep(2)} className="text-[#800000] text-[14px] font-medium uppercase border border-[#e0e0e0] px-4 py-1 rounded-sm bg-white hover:bg-gray-50">
                Change
              </button>
            )}
          </div>
          
          {activeStep === 2 && (
            <div className="bg-[#fffcfc] px-8 py-6 border-b border-gray-200">
              <form onSubmit={handleAddressSubmit} className="flex flex-col gap-4 max-w-[600px]">
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" name="name" value={address.name} placeholder="Name" onChange={handleChange} className="border border-gray-300 p-3 rounded-sm text-[14px] outline-none focus:border-[#800000] bg-white" />
                  <input required type="text" name="phone" value={address.phone} placeholder="10-digit mobile number" onChange={handleChange} className="border border-gray-300 p-3 rounded-sm text-[14px] outline-none focus:border-[#800000] bg-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" name="pincode" value={address.pincode} placeholder="Pincode" onChange={handleChange} className="border border-gray-300 p-3 rounded-sm text-[14px] outline-none focus:border-[#800000] bg-white" />
                  <input required type="text" name="locality" value={address.locality} placeholder="Locality" onChange={handleChange} className="border border-gray-300 p-3 rounded-sm text-[14px] outline-none focus:border-[#800000] bg-white" />
                </div>

                <textarea required name="fullAddress" value={address.fullAddress} placeholder="Address (Area and Street)" onChange={handleChange} rows="3" className="border border-gray-300 p-3 rounded-sm text-[14px] outline-none focus:border-[#800000] bg-white resize-none"></textarea>

                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" name="city" value={address.city} placeholder="City/District/Town" onChange={handleChange} className="border border-gray-300 p-3 rounded-sm text-[14px] outline-none focus:border-[#800000] bg-white" />
                  <select required name="state" value={address.state} onChange={handleChange} className="border border-gray-300 p-3 rounded-sm text-[14px] outline-none focus:border-[#800000] bg-white text-[#212121]">
                    <option value="">--Select State--</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>

                <div className="mt-4 flex gap-4 items-center">
                  <button type="submit" className="bg-[#fb641b] text-white px-10 py-3 rounded-sm font-medium text-[14px] uppercase shadow hover:bg-[#f05c13] transition">
                    Deliver Here
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* STEP 3: Order Summary */}
        <div className="bg-white shadow-sm rounded-sm border border-gray-100">
          <div className={`${activeStep === 3 ? 'bg-[#800000] text-white' : 'bg-white text-[#878787]'} px-6 py-3 flex items-center justify-between rounded-t-sm transition-colors ${activeStep < 3 && 'opacity-60'}`}>
            <div className="flex items-center gap-4">
              <div className={`${activeStep === 3 ? 'bg-white text-[#800000]' : 'bg-[#f1f3f6] text-[#800000]'} w-6 h-6 rounded-sm flex items-center justify-center font-medium text-[14px]`}>
                3
              </div>
              <div className="flex flex-col">
                <span className={`${activeStep === 3 ? 'text-white' : 'text-[#878787]'} text-[16px] font-medium uppercase`}>
                  Order Summary
                </span>
                {activeStep > 3 && (
                  <span className="text-[#212121] text-[14px] font-medium mt-1 normal-case">
                    {totalItems} Item{totalItems > 1 && 's'}
                  </span>
                )}
              </div>
            </div>
            {activeStep > 3 && (
              <button onClick={() => setActiveStep(3)} className="text-[#800000] text-[14px] font-medium uppercase border border-[#e0e0e0] px-4 py-1 rounded-sm bg-white hover:bg-gray-50">
                Change
              </button>
            )}
          </div>
          
          {activeStep === 3 && (
            <div className="bg-white border-b border-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="px-6 py-4 flex gap-6 border-b border-gray-100 last:border-0">
                  <div className="w-[80px] h-[80px] shrink-0">
                    <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[14px] text-[#212121] font-medium">{item.product.title}</span>
                    <span className="text-[12px] text-[#878787] mt-1 capitalize">Quantity: {item.quantity}</span>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[14px] text-[#878787] line-through">₹{item.product.original_price.toLocaleString('en-IN')}</span>
                      <span className="text-[16px] font-medium text-[#212121]">₹{item.product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-6 py-4 bg-[#fffcfc] flex justify-end">
                <button onClick={handleSummaryContinue} className="bg-[#fb641b] text-white px-10 py-3 rounded-sm font-medium text-[14px] uppercase shadow hover:bg-[#f05c13] transition">
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STEP 4: Payment Options */}
        <div className="bg-white shadow-sm rounded-sm border border-gray-100">
          <div className={`${activeStep === 4 ? 'bg-[#800000] text-white' : 'bg-white text-[#878787]'} px-6 py-3 flex items-center justify-between rounded-t-sm transition-colors ${activeStep < 4 && 'opacity-60'}`}>
            <div className="flex items-center gap-4">
              <div className={`${activeStep === 4 ? 'bg-white text-[#800000]' : 'bg-[#f1f3f6] text-[#800000]'} w-6 h-6 rounded-sm flex items-center justify-center font-medium text-[14px]`}>
                4
              </div>
              <span className={`${activeStep === 4 ? 'text-white' : 'text-[#878787]'} text-[16px] font-medium uppercase`}>
                Payment Options
              </span>
            </div>
          </div>
          
          {activeStep === 4 && (
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center border-b border-gray-100 pb-4 opacity-50 cursor-not-allowed">
                  <input type="radio" disabled className="w-4 h-4" />
                  <span className="text-[16px] text-[#212121]">UPI (Google Pay, PhonePe)</span>
                </div>
                <div className="flex gap-4 items-center border-b border-gray-100 pb-4 opacity-50 cursor-not-allowed">
                  <input type="radio" disabled className="w-4 h-4" />
                  <span className="text-[16px] text-[#212121]">Credit / Debit / ATM Card</span>
                </div>
                <div className="flex gap-4 items-center border-b border-gray-100 pb-4 opacity-50 cursor-not-allowed">
                  <input type="radio" disabled className="w-4 h-4" />
                  <span className="text-[16px] text-[#212121]">Net Banking</span>
                </div>

                {/* Cash On Delivery (Active Option) */}
                <div className="flex gap-4 items-start bg-[#fffcfc] p-4 border border-[#ffcdd2]">
                  <input type="radio" checked readOnly className="w-4 h-4 mt-1 accent-[#800000]" />
                  <div className="flex flex-col flex-1">
                    <span className="text-[16px] font-medium text-[#212121]">Cash on Delivery</span>
                    <button 
                      onClick={handleConfirmOrder}
                      disabled={placeOrderMutation.isPending || isOrderPlaced}
                      className="mt-4 bg-[#fb641b] text-white px-10 py-3 rounded-sm font-medium text-[16px] uppercase shadow hover:bg-[#f05c13] transition w-[250px] disabled:opacity-70"
                    >
                      {placeOrderMutation.isPending || isOrderPlaced ? 'Processing...' : 'Confirm Order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Price Details (Always visible) */}
      <div className="w-full lg:w-[350px]">
        <div className="bg-white shadow-sm rounded-sm sticky top-[70px] border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-[16px] font-medium text-[#878787] uppercase tracking-wide">
              Price Details
            </h2>
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
              <span>Amount Payable</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            
            <div className="text-[14px] font-medium text-[#388e3c] flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#388e3c"><path d="M8 0L6.5 4.5 2 3l3 3.5-3 4 4.5-1.5L8 14l1.5-5 4.5 1.5-3-4 3-3.5-4.5 1.5L8 0z"/></svg>
              Your Total Savings on this order ₹{totalDiscount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}