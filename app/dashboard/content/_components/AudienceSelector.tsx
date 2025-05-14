"use client";
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AudienceSelectorProps {
  onAudienceChange: (audience: string) => void;
  selectedAudience: string;
}

const AUDIENCES = [
  { value: 'general', label: 'General Audience' },
  { value: 'tech', label: 'Tech Enthusiasts' },
  { value: 'business', label: 'Business Professionals' },
  { value: 'students', label: 'Students' },
  { value: 'academic', label: 'Academic Researchers' },
  { value: 'creative', label: 'Creative Professionals' },
  { value: 'marketing', label: 'Marketing Professionals' },
  { value: 'healthcare', label: 'Healthcare Professionals' },
  { value: 'legal', label: 'Legal Professionals' },
  { value: 'finance', label: 'Finance Professionals' },
];

export default function AudienceSelector({ onAudienceChange, selectedAudience }: AudienceSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Target Audience
      </label>
      <Select value={selectedAudience} onValueChange={onAudienceChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select your target audience" />
        </SelectTrigger>
        <SelectContent>
          {AUDIENCES.map((audience) => (
            <SelectItem key={audience.value} value={audience.value}>
              {audience.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 