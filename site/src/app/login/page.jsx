// src/app/login/page.jsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  
  // View states: 'login', 'signup', or 'forgot'
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // 1. FORGOT PASSWORD FLOW
      if (view === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        const json = await res.json();
        if (json.success) {
          setSuccessMsg('Password reset link sent to your email!');
          setFormData({ ...formData, email: '' });
        } else throw new Error(json.error);
      } 
      
      // 2. SIGNUP FLOW
      else if (view === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const json = await res.json();
        if (json.success) {
          setSuccessMsg('Account created successfully! Please log in.');
          setView('login');
          setFormData({ ...formData, password: '' });
        } else throw new Error(json.error);
      } 
      
      // 3. LOGIN FLOW
      else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const json = await res.json();
        if (json.success) {
          // Force a hard reload so the Navbar can check the new auth state.
          window.location.href = '/'; 
        } else throw new Error(json.error);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#f1f3f6] p-4 mt-8 mb-12">
      <div className="flex bg-white shadow-md rounded-sm overflow-hidden w-full max-w-[850px] min-h-[500px]">
        
        {/* LEFT COLUMN: Maroon Branding */}
        <div className="hidden md:flex flex-col justify-between bg-[#800000] w-[40%] p-10 text-white">
          <div>
            <h1 className="text-[28px] font-medium mb-4">
              {view === 'login' ? 'Login' : view === 'signup' ? 'Looks like you\'re new here!' : 'Reset Password'}
            </h1>
            <p className="text-[18px] text-gray-200 leading-relaxed">
              {view === 'login' 
                ? 'Get access to your Orders, Wishlist and Recommendations' 
                : view === 'signup' 
                ? 'Sign up with your email to get started' 
                : 'Enter your email address and we will send you a link to reset your password.'}
            </p>
          </div>
          {/* Illustration placeholder */}
          <div className="flex justify-center mt-10">
            <img src="/login_image.png" alt="Auth Illustration" className="opacity-90" />
          </div>
        </div>

        {/* RIGHT COLUMN: Form Area */}
        <div className="w-full md:w-[60%] p-8 sm:p-12 flex flex-col">
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-6 pt-4">
            
            {/* Show Name field only on Signup */}
            {view === 'signup' && (
              <div className="relative border-b border-gray-300 focus-within:border-[#800000]">
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full py-2 outline-none text-[15px] text-[#212121] peer bg-transparent placeholder-transparent" placeholder="Full Name" />
                <label className="absolute left-0 top-2 text-[#878787] text-[15px] transition-all peer-focus:-top-3.5 peer-focus:text-[12px] peer-focus:text-[#800000] peer-valid:-top-3.5 peer-valid:text-[12px]">Full Name</label>
              </div>
            )}

            {/* Email Field (Always visible) */}
            <div className="relative border-b border-gray-300 focus-within:border-[#800000]">
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full py-2 outline-none text-[15px] text-[#212121] peer bg-transparent placeholder-transparent" placeholder="Email Address" />
              <label className="absolute left-0 top-2 text-[#878787] text-[15px] transition-all peer-focus:-top-3.5 peer-focus:text-[12px] peer-focus:text-[#800000] peer-valid:-top-3.5 peer-valid:text-[12px]">Enter Email Address</label>
            </div>

            {/* Show Password only on Login and Signup */}
            {view !== 'forgot' && (
              <div className="relative border-b border-gray-300 focus-within:border-[#800000]">
                <input required type="password" name="password" value={formData.password} onChange={handleChange} minLength={6} className="w-full py-2 outline-none text-[15px] text-[#212121] peer bg-transparent placeholder-transparent" placeholder="Password" />
                <label className="absolute left-0 top-2 text-[#878787] text-[15px] transition-all peer-focus:-top-3.5 peer-focus:text-[12px] peer-focus:text-[#800000] peer-valid:-top-3.5 peer-valid:text-[12px]">Enter Password</label>
                
                {view === 'login' && (
                  <span onClick={() => { setView('forgot'); setError(''); setSuccessMsg(''); }} className="absolute right-0 top-2 text-[12px] text-[#800000] font-medium cursor-pointer hover:underline z-10">
                    Forgot?
                  </span>
                )}
              </div>
            )}

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 text-[12px] mt-[-10px]">{error}</p>}
            {successMsg && <p className="text-green-600 text-[13px] mt-[-10px]">{successMsg}</p>}

            {/* Terms text for Signup */}
            {view === 'signup' && (
              <p className="text-[12px] text-[#878787]">
                By continuing, you agree to Cartify's <span className="text-[#800000] cursor-pointer hover:underline">Terms of Use</span> and <span className="text-[#800000] cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            )}

            {/* Submit Button */}
            <button disabled={loading} type="submit" className="bg-[#fb641b] text-white py-3 rounded-sm font-medium text-[15px] shadow mt-4 hover:bg-[#f05c13] transition disabled:opacity-70">
              {loading ? 'Please wait...' : view === 'login' ? 'Login' : view === 'signup' ? 'Continue' : 'Send Reset Link'}
            </button>
          </form>

          {/* Toggle View Links at the bottom */}
          <div className="mt-8 text-center">
            {view === 'login' ? (
              <span onClick={() => { setView('signup'); setError(''); }} className="text-[#800000] text-[14px] font-medium cursor-pointer hover:underline">
                New to Cartify? Create an account
              </span>
            ) : (
              <button onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }} className="bg-white text-[#800000] w-full py-3 rounded-sm font-medium text-[15px] shadow-sm border border-gray-200 hover:shadow-md transition">
                Existing User? Log in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}