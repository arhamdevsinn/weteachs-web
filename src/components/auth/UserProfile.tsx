"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/src/lib/firebase/auth';
import { useAuth } from '@/src/hooks/useAuth';
import { useUserProfile } from '@/src/hooks/useUserProfile';
import { UserProfileAPI } from '@/src/lib/api/userProfile';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const { 
    profile, 
    teacherDetails, 
    loading: dataLoading, 
    error: dataError,
    refreshData 
  } = useUserProfile(user?.uid);
  console.log('UserProfile data:', { profile, teacherDetails, dataError });

  const handleSignOut = async () => {
    setActionLoading(true);
    setError('');

    try {
      await AuthService.logout('/login');
    } catch (err: any) {
      setError(err.message);
      setActionLoading(false);
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'Not specified';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Not Logged In</h2>
        <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="bg-secondary min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (dataError || !profile) {
    return (
      <div className="bg-secondary min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{dataError || 'Profile not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary min-h-screen py-8 px-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 px-4 py-6">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-secondary to-secondary rounded-full opacity-20"></div>
            <Image
              src={profile.photo_url || "/profile.png"}
              alt="profile"
              width={160}
              height={160}
              className="rounded-full border-4 border-secondary shadow-lg relative"
            />
          </div>
          <div className="text-center md:text-left">
            <div className="text-primary font-bold text-2xl md:text-3xl mb-1">
              {profile.display_name}
            </div>
            <div className="text-gray-600 mb-1">{profile.email}</div>
            {profile.isTeacher && (
              <div className="bg-secondary text-primary text-sm px-3 py-1 rounded-full inline-block mt-2">
                👨‍🏫 Teacher
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex gap-6 mb-4 font-semibold">
            {['Profile', 'Account', 'Teacher'].map((tab) => (
              <button
                key={tab}
                className={`pb-2 px-1 transition-colors ${activeTab === tab.toLowerCase() 
                  ? "border-b-2 border-primary text-gray-800" 
                  : "text-gray-400 hover:text-gray-600"}`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 rounded-xl p-4 min-h-[200px]">
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Display Name:</span>
                      <span className="ml-2">{profile.display_name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2">{profile.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Birthday:</span>
                      <span className="ml-2">{formatDate(profile.Birthday)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Member Since:</span>
                      <span className="ml-2">{formatDate(profile.created_time)}</span>
                    </div>
                    {profile.Howd_you_here_of_us && (
                      <div>
                        <span className="font-medium text-gray-700">How you heard about us:</span>
                        <span className="ml-2">{profile.Howd_you_here_of_us}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Account Status</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Profile Complete:</span>
                      <span className="ml-2">{profile.bio_set ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Signup Complete:</span>
                      <span className="ml-2">{profile.signupcomplete ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Teacher Account:</span>
                      <span className="ml-2">{profile.isTeacher ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Pre-tester:</span>
                      <span className="ml-2">{profile.Pre_testers ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'teacher' && profile.isTeacher && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Teacher Information</h3>
                {teacherDetails ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium text-gray-700">Teacher ID:</div>
                      <div className="text-gray-600">{teacherDetails.id}</div>
                    </div>
                    {/* Add more teacher details here as needed */}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Teacher details loading...
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'account' && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Account Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleSignOut}
                    disabled={actionLoading}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {actionLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing Out...
                      </>
                    ) : (
                      'Sign Out'
                    )}
                  </button>
                  
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  
                  <button
                    onClick={() => router.push('/settings')}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                  >
                    Account Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;