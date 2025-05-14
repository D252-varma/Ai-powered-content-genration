import { useState } from 'react';
import { Button } from './button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface KeywordExtractorProps {
  content: string;
}

export function KeywordExtractor({ content }: KeywordExtractorProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const extractKeywords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/extract-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to extract keywords');
      }

      const data = await response.json();
      setKeywords(data.keywords);
    } catch (error) {
      toast.error('Failed to extract keywords');
      console.error('Error extracting keywords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyHashtags = () => {
    const hashtags = keywords.map(keyword => `#${keyword.replace(/\s+/g, '')}`).join(' ');
    navigator.clipboard.writeText(hashtags);
    toast.success('Hashtags copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={extractKeywords}
        disabled={isLoading}
        className="w-full bg-[linear-gradient(90deg,_rgba(44,44,54,1)_0%,_rgba(23,25,33,1)_37%,_rgba(68,66,66,1)_100%)]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Extracting Keywords...
          </>
        ) : (
          'Extract Keywords'
        )}
      </Button>

      {keywords.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-transparent border border-[#2c2c36] text-[#2c2c36] rounded-full text-sm hover:bg-[#2c2c36] hover:text-white transition-colors"
              >
                {keyword}
              </span>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyHashtags}
            className="w-full"
          >
            Copy Hashtags
          </Button>
        </div>
      ) : (
        !isLoading && (
          <p className="text-muted-foreground text-center">
            No keywords extracted
          </p>
        )
      )}
    </div>
  );
} 