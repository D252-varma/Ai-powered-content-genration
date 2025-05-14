"use client";
import React from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Mail, User } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>Email: {user?.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>Name: {user?.fullName || 'Not set'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>Account Type: {(user?.publicMetadata as { accountType?: string })?.accountType || 'Standard'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Sign Out</CardTitle>
          </CardHeader>
          <CardContent>
            <SignOutButton>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </SignOutButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 