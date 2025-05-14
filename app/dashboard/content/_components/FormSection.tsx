"use client";
import React, { useState } from 'react'
import { TEMPLATE } from '../../-components/TemplateListSection'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2Icon } from 'lucide-react';
import AudienceSelector from './AudienceSelector';

interface PROPS{
  selectedTemplate?:TEMPLATE;
  userFormInput:any,
  loading:boolean
}

function FormSection({selectedTemplate,userFormInput,loading}:PROPS) {
  const [formData, setFormData] = useState<any>({});
  const [selectedAudience, setSelectedAudience] = useState('general');

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    userFormInput({
      ...formData,
      audience: selectedAudience
    });
  };

  return (
    <div className="bg-white shadow-lg border rounded-lg p-5">
      <div className="flex gap-2 items-center mb-5">
        <Image
          src={selectedTemplate?.icon || ''}
          alt={selectedTemplate?.name || ''}
          width={40}
          height={40}
        />
        <h2 className="font-medium text-lg">{selectedTemplate?.name}</h2>
      </div>

      <div className="space-y-4">
        {selectedTemplate?.form.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            {field.field === 'input' ? (
              <Input
                placeholder={`Enter ${field.label.toLowerCase()}`}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
            ) : (
              <Textarea
                placeholder={`Enter ${field.label.toLowerCase()}`}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
            )}
          </div>
        ))}

        <AudienceSelector
          selectedAudience={selectedAudience}
          onAudienceChange={setSelectedAudience}
        />

        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="w-full bg-[linear-gradient(90deg,_rgba(44,44,54,1)_0%,_rgba(23,25,33,1)_37%,_rgba(68,66,66,1)_100%)]"
        >
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Content'
          )}
        </Button>
      </div>
    </div>
  );
}

export default FormSection;