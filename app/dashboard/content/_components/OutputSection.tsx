"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { KeywordExtractor } from "@/components/ui/keyword-extractor";

// ✅ Fix: Correct dynamic import with named export for Editor
const Editor = dynamic(() => import("@toast-ui/react-editor").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface Props {
  aiOutput: string;
}

function OutputSection({ aiOutput }: Props) {
  const editorRef = useRef<any>(null);
  const [editorContent, setEditorContent] = useState<string>("");

  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      if (typeof aiOutput === "string") {
        editorInstance.setMarkdown(aiOutput);
        setEditorContent(aiOutput);
      }
    }
  }, [aiOutput]);

  const copyToClipboard = async () => {
    try {
      if (editorRef.current) {
        const editorInstance = editorRef.current.getInstance();
        const content = editorInstance.getMarkdown();
        await navigator.clipboard.writeText(content);
        toast.success('Content copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy content');
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      const content = editorInstance.getMarkdown();
      setEditorContent(content);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg border rounded-lg">
        <div className="flex justify-between items-center p-5">
          <h2 className="font-medium text-lg">Your Result</h2>
          <Button 
            onClick={copyToClipboard} 
            className="flex gap-2 bg-[linear-gradient(90deg,_rgba(44,44,54,1)_0%,_rgba(23,25,33,1)_37%,_rgba(68,66,66,1)_100%)]"
          >
            <Copy className="w-4 h-4" /> Copy
          </Button>
        </div>
        {Editor && (
          <Editor
            ref={editorRef}
            initialValue="Your Result Will Appear Here"
            height="600px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            onChange={handleEditorChange}
          />
        )}
      </div>

      {/* Add Keyword Extractor */}
      {editorContent && (
        <div className="bg-white shadow-lg border rounded-lg p-5">
          <h2 className="font-medium text-lg mb-4">Keyword Extraction</h2>
          <KeywordExtractor content={editorContent} />
        </div>
      )}
    </div>
  );
}

export default OutputSection;