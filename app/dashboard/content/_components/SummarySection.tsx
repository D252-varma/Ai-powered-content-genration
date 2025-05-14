"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Twitter, Linkedin, Instagram, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { toast } from "sonner";

interface SummarySectionProps {
  content: string;
}

type SummaryLength = 'short' | 'medium' | 'detailed';

export default function SummarySection({ content }: SummarySectionProps) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');

  const generateSummary = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to summarize');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          length: summaryLength,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      if (!data.summary) {
        throw new Error('No summary received from the API');
      }

      setSummary(data.summary);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          toast.error('Invalid API key. Please check your configuration.');
        } else if (error.message.includes('network')) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Failed to generate summary. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const shareToSocial = async (platform: string) => {
    try {
      setSharing(platform);
      let shareUrl = '';
      let shareText = summary;

      switch (platform) {
        case 'twitter':
          shareText = summary.slice(0, 280);
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareText)}`;
          break;
        case 'instagram':
          await copyToClipboard();
          toast.info('Content copied! You can now paste it on Instagram');
          return;
        default:
          return;
      }

      window.open(shareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
      toast.error(`Failed to share to ${platform}`);
    } finally {
      setSharing(null);
    }
  };

  return (
    <div className="mt-6 bg-white shadow-lg border rounded-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg">Social Media Summary</h2>
        <div className="flex gap-2">
          <Select value={summaryLength} onValueChange={(value: SummaryLength) => setSummaryLength(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={generateSummary} 
            disabled={loading || !content.trim()}
            className="bg-[linear-gradient(90deg,_rgba(44,44,54,1)_0%,_rgba(23,25,33,1)_37%,_rgba(68,66,66,1)_100%)]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Summarize'
            )}
          </Button>
        </div>
      </div>

      {summary && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{summary}</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={copyToClipboard} className="flex gap-2">
              <Copy className="w-4 h-4" /> Copy
            </Button>
            <Button 
              variant="outline" 
              onClick={() => shareToSocial('twitter')} 
              className="flex gap-2"
              disabled={sharing === 'twitter'}
            >
              <Twitter className="w-4 h-4" /> {sharing === 'twitter' ? 'Sharing...' : 'Twitter'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => shareToSocial('linkedin')} 
              className="flex gap-2"
              disabled={sharing === 'linkedin'}
            >
              <Linkedin className="w-4 h-4" /> {sharing === 'linkedin' ? 'Sharing...' : 'LinkedIn'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => shareToSocial('instagram')} 
              className="flex gap-2"
              disabled={sharing === 'instagram'}
            >
              <Instagram className="w-4 h-4" /> {sharing === 'instagram' ? 'Copying...' : 'Instagram'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 