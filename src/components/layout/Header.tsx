"use client"
import React from 'react'
import Image from 'next/image'

const Header = () => {
  return (
    <div className='text-3xl font-bold text-primary items-center gap-2 w-full p-4  flex'>
      <Image src="/logo.png" alt="logo" width={60} height={60}/>
      WeTeachs
    </div>
  )
}

export default Header
