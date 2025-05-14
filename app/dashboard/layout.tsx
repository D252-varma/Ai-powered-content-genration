"use client";
import React from 'react'
import SideNav from './-components/SideNav';
import Header from './-components/Header';
import { useUser } from '@clerk/nextjs';
 
function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-slate-100 h-full'>
      <div className='md:w-64 hidden md:block fixed'>
        <SideNav/>
      </div>
      <div className='md:ml-64'>
        <Header/>
        {children}
      </div>
    </div>
  )
}
 
export default layout