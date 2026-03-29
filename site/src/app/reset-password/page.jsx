// src/app/reset-password/page.jsx
"use client";

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Safely extract params after mount to avoid hydration errors
  useEffect(() => {
    setToken(searchParams.get('token') || '');
    setEmail(searchParams.get('email') || '');
  }, [searchParams]);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (passwords.newPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          token, 
          newPassword: passwords.newPassword 
        })
      });
      
      const json = await res.json();
      
      if (json.success) {
        setSuccess(true);
      } else {
        setError(json.error || 'Reset failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center p-10 bg-white shadow-sm rounded-sm">
        <h2 className="text-xl font-medium text-red-500">Invalid Link</h2>
        <p className="text-gray-500 mt-2 text-sm">Please request a new password reset email.</p>
        <Link href="/login" className="text-[#2874f0] hover:underline mt-4 inline-block font-medium">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white shadow-md rounded-sm border-t-4 border-[#800000]">
      <h2 className="text-[22px] font-medium text-[#212121] mb-2">Create New Password</h2>
      <p className="text-[14px] text-[#878787] mb-6">Enter a new password for <span className="text-[#212121] font-medium">{email}</span></p>

      {success ? (
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#388e3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <p className="text-green-600 font-bold mb-6 text-center text-lg">Success!</p>
          <Link href="/login" className="w-full">
             <button className="w-full bg-[#2874f0] text-white py-3 rounded-sm font-medium shadow-sm hover:bg-[#1c5cbf] transition">
                Login with New Password
             </button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative border-b border-gray-300 focus-within:border-[#2874f0]">
            <input required type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} className="w-full py-2 outline-none text-[15px] text-[#212121] peer bg-transparent placeholder-transparent" placeholder="New Password" />
            <label className="absolute left-0 top-2 text-[#878787] text-[15px] transition-all peer-focus:-top-3.5 peer-focus:text-[12px] peer-focus:text-[#2874f0] peer-valid:-top-3.5 peer-valid:text-[12px]">New Password</label>
          </div>

          <div className="relative border-b border-gray-300 focus-within:border-[#2874f0]">
            <input required type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className="w-full py-2 outline-none text-[15px] text-[#212121] peer bg-transparent placeholder-transparent" placeholder="Confirm Password" />
            <label className="absolute left-0 top-2 text-[#878787] text-[15px] transition-all peer-focus:-top-3.5 peer-focus:text-[12px] peer-focus:text-[#2874f0] peer-valid:-top-3.5 peer-valid:text-[12px]">Confirm Password</label>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 text-[13px] rounded-sm border border-red-100">
              {error}
            </div>
          )}

          <button disabled={loading} type="submit" className="bg-[#fb641b] text-white py-3 rounded-sm font-medium text-[15px] shadow mt-2 hover:bg-[#f05c13] transition disabled:opacity-70">
            {loading ? 'SAVING...' : 'UPDATE PASSWORD'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#f1f3f6] p-4">
      <Suspense fallback={<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}