"use client";
import { SignIn } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4"
        onClick={() => router.push('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="flex items-center justify-center h-screen">
        <SignIn />
      </div>
    </div>
  )
}