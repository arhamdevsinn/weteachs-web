"use client"
import React from 'react'
import Image from 'next/image'
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthService } from '@/src/lib/firebase/auth';
import { useAuth } from '@/src/hooks/useAuth';

const Header = () => {
   const pathname = usePathname();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show navigation for non-authenticated users
  }

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
    { href: '/settings', label: 'Settings' },
    { href: '/community', label: 'Community' },
    { href: '/categories', label: 'Categories' },

  ];


  return (
    <div className=' items-center justify-between w-full p-4  flex'>
     <div className='text-3xl font-bold text-primary flex items-center gap-2'>
       <Image src="/logo.png" alt="logo" width={60} height={60}/>
      WeTeachs
     </div>
       <div className="flex space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-primary text-secondary'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
            <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Hi, {user.displayName || user.email}
            </span>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-secondary hover:text-black disabled:opacity-50 transition-colors"
            >
              {loading ? '...' : 'Sign Out'}
            </button>
          </div>
    </div>
  )
}

export default Header
