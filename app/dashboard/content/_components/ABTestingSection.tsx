"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface ABTestingSectionProps {
  content: string;
}

interface ContentVariation {
  id: string;
  content: string;
  selected: boolean;
}

export default function ABTestingSection({ content }: ABTestingSectionProps) {
  const [variations, setVariations] = useState<ContentVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);

  const generateVariations = async () => {
    if (!content.trim()) {
      toast.error('Please generate content first');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/generate-variations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate variations');
      }

      if (!data.variations || data.variations.length === 0) {
        throw new Error('No variations received from the API');
      }

      // Create variations with unique IDs
      const newVariations = data.variations.map((content: string, index: number) => ({
        id: `variation-${index + 1}`,
        content,
        selected: false,
      }));

      setVariations(newVariations);
      toast.success('Content variations generated successfully!');
    } catch (error) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to generate variations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectVariation = (id: string) => {
    setSelectedVariation(id);
    setVariations(variations.map(v => ({
      ...v,
      selected: v.id === id
    })));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  return (
    <div className="mt-6 bg-white shadow-lg border rounded-lg p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-lg">A/B Testing Variations</h2>
        <Button 
          onClick={generateVariations} 
          disabled={loading || !content.trim()}
          className="bg-[linear-gradient(90deg,_rgba(44,44,54,1)_0%,_rgba(23,25,33,1)_37%,_rgba(68,66,66,1)_100%)]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Variations'
          )}
        </Button>
      </div>

      {variations.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variations.map((variation) => (
              <div 
                key={variation.id}
                className={`p-4 rounded-lg border ${
                  variation.selected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Variation {variation.id.split('-')[1]}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => selectVariation(variation.id)}
                      className={variation.selected ? 'text-blue-500' : ''}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {variation.selected ? 'Selected' : 'Select'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(variation.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{variation.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 