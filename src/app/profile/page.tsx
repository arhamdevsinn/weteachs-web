'use client'
import React, { useState } from 'react'
import Image from 'next/image'

const Page = () => {
  const [activeTab, setActiveTab] = useState('images');
  
  return (
    <div className="bg-secondary min-h-screen py-8 px-4">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-w-7xl mx-auto">
        {/* Profile + Name */}
        <div className="flex flex-col md:flex-row items-center gap-6 px-4 py-6">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-secondary to-secondary rounded-full opacity-20"></div>
            <Image
              src="/profile.png"
              alt="profile"
              width={160}
              height={160}
              className="rounded-full border-4 border-secondary shadow-lg relative"
            />
          </div>
          <div className="text-center md:text-left">
            <div className="text-primary font-bold text-2xl md:text-3xl mb-1">Expert Name</div>
            <div className="text-gray-600 mb-1 flex items-center justify-center md:justify-start">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Available now (0/15min)
            </div>
            <div className="text-gray-600 mb-1">English, Spanish, French</div>
            <div className="bg-secondary text-primary text-sm px-3 py-1 rounded-full inline-block mt-2">
              🎯 Top-rated Expert
            </div>
          </div>
        </div>

        {/* Settings / Stats */}
        <div className="border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-6 mt-4">
          <div className='flex flex-col items-center'>
            <button className="bg-primary hover:from-green-800 hover:to-primary text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-md transition-all transform hover:-translate-y-1">
              Profile Settings
            </button>
            <div className="flex gap-1 mt-4 text-amber-400 text-xl">
              {'★'.repeat(4)}
              <span className="text-gray-300">★</span>
              <span className="text-gray-600 text-sm ml-1 self-center">4.0</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="bg-primary w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <span className="text-2xl">42</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-md">
                +5
              </div>
            </div>
            <div className="text-md mt-3 text-gray-700 font-medium">Completed Jobs</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-primary w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              <span className="text-xl">$248.50</span>
            </div>
            <div className="text-md mt-3 text-gray-700 font-medium">Total Earned</div>
          </div>
        </div>

        {/* Socials */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-6 mt-6 text-sm">
          <div className="text-gray-700 font-medium mb-2 sm:mb-0">Connect with me:</div>
          <div className="flex gap-4 text-2xl">
            <a href="#" className="bg-secondary p-2 rounded-full hover:bg-blue-100 hover:text-blue-500 transition-colors"><span>🎥</span></a>
            <a href="#" className="bg-secondary p-2 rounded-full hover:bg-pink-100 hover:text-pink-500 transition-colors"><span>📸</span></a>
            <a href="#" className="bg-secondary p-2 rounded-full hover:bg-green-100 hover:text-green-500 transition-colors"><span>🎵</span></a>
            <a href="#" className="bg-secondary p-2 rounded-full hover:bg-purple-100 hover:text-purple-500 transition-colors"><span>🔗</span></a>
          </div>
        </div>

        {/* Heart + Website */}
        <div className="flex justify-between items-center mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-black font-bold mr-2">website.com/profile</span>
            <span className="text-blue-500 text-xs bg-blue-100 px-2 py-1 rounded">Verified</span>
          </div>
          <button className="text-xl transition-transform hover:scale-110 active:scale-95">
            <span className="text-red-500">❤️</span>
          </button>
        </div>

        {/* Bio */}
        <div className="mt-6 p-4 bg-secondary rounded-xl">
          <div className="font-bold text-lg text-gray-800 mb-2">About Me</div>
          <div className="text-gray-700">
            Hello! I'm an experienced professional with over 5 years in digital marketing and content strategy. 
            I specialize in helping businesses grow their online presence through data-driven approaches.
          </div>
          <div className="text-primary font-semibold cursor-pointer mt-2 inline-block hover:underline">
            Read more
          </div>
        </div>

        {/* Sections */}
        <div className="mt-6 flex flex-wrap gap-3 justify-start">
          {['Services', 'Portfolio', 'Testimonials', 'Resources', 'Contact'].map((item, index) => (
            <a 
              key={index} 
              href="#" 
              className="px-4 py-2 bg-white border border-gray-200 text-primary font-medium rounded-full hover:bg-green-50 transition-colors text-sm shadow-sm"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="flex gap-6 mb-4 font-semibold">
            {['Images', 'Videos', 'Info'].map((tab) => (
              <button
                key={tab}
                className={`pb-2 px-1 transition-colors ${activeTab === tab.toLowerCase() 
                  ? 'border-b-2 border-primary text-gray-800' 
                  : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-50 rounded-xl p-4 min-h-[120px]">
            {activeTab === 'images' && (
              <div className="text-sm">
                <div className="font-bold text-gray-800 mb-2">Recent Work Samples</div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="aspect-square bg-secondary rounded-lg flex items-center justify-center text-gray-500">
                      <Image
                        src="/sample.png" alt="placeholder" width={400} height={300}/>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">Uploaded 2 days ago</div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="mr-1">❤️</span>
                    <span>24 Likes</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'videos' && (
              <div className="text-center py-8 text-gray-500">
                No videos uploaded yet
              </div>
            )}
            
            {activeTab === 'info' && (
              <div className="text-center py-8 text-gray-500">
                Additional information will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page