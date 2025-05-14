"use client";
import React, { useState } from 'react'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { TEMPLATE } from '../../-components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft} from 'lucide-react';
import Link from 'next/link';
import { chatSession } from '@/utils/AiMoal';
import { useUser } from '@clerk/nextjs'

interface PROPS{
  params:{
    'template-slug':string
  }
}

function CreateNewContent(props:PROPS) {

  const params = useParams(); // ✅ Awaiting params correctly

  const selectedTemplate: TEMPLATE | undefined = Templates?.find(
    (item) => item.slug === params["template-slug"]
  );
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>('');

  const GenerateAIContent = async (FormData: any) => {
    setLoading(true);
    try {
      const SelectedPromt = selectedTemplate?.aiPrompt;
      const finalPrompt = JSON.stringify(FormData) + ", " + SelectedPromt;
      
      // Add retry logic
      let retries = 3;
      let lastError: Error | null = null;
      
      while (retries > 0) {
        try {
          const result = await chatSession.sendMessage(finalPrompt);
          console.log(result.response.text());
          setAiOutput(result?.response.text());
          setLoading(false);
          return; // Success, exit the function
        } catch (error: unknown) {
          lastError = error as Error;
          console.error(`Attempt ${4 - retries} failed:`, error);
          
          // Check if it's a 503 error
          if (error instanceof Error && 
              (error.message?.includes('503') || error.message?.includes('overloaded'))) {
            retries--;
            if (retries > 0) {
              // Wait for 2 seconds before retrying
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
          } else {
            // If it's not a 503 error, break the retry loop
            break;
          }
        }
      }
      
      // If we've exhausted all retries or encountered a different error
      throw lastError;
      
    } catch (error: unknown) {
      console.error('Error generating AI content:', error);
      setLoading(false);
      // Show user-friendly error message
      setAiOutput('Sorry, we encountered an error while generating content. Please try again in a few moments.');
    }
  };

  return (
    <div className='p-10'>
      <Link href={"/dashboard"} >
      <Button className='bg-[linear-gradient(90deg,_rgba(44,44,54,1)_0%,_rgba(23,25,33,1)_37%,_rgba(68,66,66,1)_100%)]'> <ArrowLeft/>  Back</Button>
      </Link>
    <div className='grid grid-cols-1 md:grid-cols-3  gap-10 py-5'>

      <FormSection selectedTemplate={selectedTemplate} userFormInput={(v: any) => GenerateAIContent(v)} loading = {loading}/>

      <div className='col-span-2'>
      <OutputSection aiOutput={aiOutput}/>
      </div>
    </div>
    </div>
  )
}

export default CreateNewContent