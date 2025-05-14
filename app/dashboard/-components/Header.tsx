"use client";
import { Search, TrendingUp, Hash } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function Header() {
  const { isSignedIn } = useUser();
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);

  // Simulated trending keywords (in a real app, this would come from an API)
  useEffect(() => {
    const keywords = [
      "AI Writing",
      "Content Creation",
      "Digital Marketing",
      "Social Media",
      "SEO Tips",
      "Content Strategy"
    ];
    
    // Randomly select 3 keywords
    const shuffled = keywords.sort(() => 0.5 - Math.random());
    setTrendingKeywords(shuffled.slice(0, 3));
  }, []);

  return (
    <div className='relative p-3 shadow-sm border-2 flex justify-between items-center bg-white'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <TrendingUp className="h-4 w-4" />
          <span>Currently Trending:</span>
        </div>
        <div className='flex items-center gap-2'>
          {trendingKeywords.map((keyword, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => {
                // Handle keyword click - you can add navigation or content generation logic here
                console.log(`Clicked keyword: ${keyword}`);
              }}
            >
              <Hash className="h-3 w-3 mr-1" />
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
      <hr className='my-6 border'/>
      <div className='flex gap-10 items-center'>
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <Button className='bg-[linear-gradient(90deg,_rgba(44,44,54,1)_0%,_rgba(23,25,33,1)_37%,_rgba(68,66,66,1)_100%)]'>
              Sign In
            </Button>
          </SignInButton>
        ) : (
          <Button variant="outline" className="cursor-pointer">
            My Account
          </Button>
        )}
      </div>
    </div>
  )
}

export default Header