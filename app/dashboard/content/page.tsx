"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ABTestingSection from './_components/ABTestingSection';

export default function ContentPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter a topic or prompt');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      if (!data.content) {
        throw new Error('No content received from the API');
      }

      setContent(data.content);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to generate content. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Content Generator</h1>
        
        <div className="space-y-6">
          <div className="bg-white shadow-lg border rounded-lg p-5">
            <h2 className="font-medium text-lg mb-4">Generate Content</h2>
            <div className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your topic or prompt..."
                className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                onClick={generateContent} 
                disabled={loading}
                className="w-full bg-[linear-gradient(90deg,_rgba(44,44,54,1)_0%,_rgba(23,25,33,1)_37%,_rgba(68,66,66,1)_100%)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Content'
                )}
              </Button>
            </div>
          </div>

          {content && <ABTestingSection content={content} />}
        </div>
      </div>
    </div>
  );
} 