"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Check } from "lucide-react";

export default function LessonPlanPromptPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPrompt();
  }, []);

  const fetchPrompt = async () => {
    try {
      const response = await fetch("/api/prompts/lesson-plan");
      if (response.ok) {
        const data = await response.json();
        setPrompt(data.prompt);
      }
    } catch (error) {
      console.error("Failed to fetch prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying prompt:", error);
      alert("Failed to copy prompt");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/prompts">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Current Lesson Plan Prompt</h1>
            <p className="text-muted-foreground mt-1">
              This is the prompt currently used by the lesson plan generator
            </p>
          </div>
          <Button onClick={handleCopy} size="lg">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Prompt
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {prompt}
        </pre>
      </Card>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h2 className="font-semibold mb-2">How to use this prompt:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Click "Copy Prompt" above to copy the entire prompt to your clipboard</li>
          <li>Go back to the Tests page and create a new prompt test</li>
          <li>Paste the prompt into the "AI Prompt" field</li>
          <li>Make any edits you want to test</li>
          <li>Run the automated test to see results across all 3 guides</li>
          <li>Save your test with notes about what you changed</li>
        </ol>
      </div>

      <div className="mt-4 text-center">
        <Link href="/prompts">
          <Button variant="outline">
            Go to Prompt Tests
          </Button>
        </Link>
      </div>
    </div>
  );
}
