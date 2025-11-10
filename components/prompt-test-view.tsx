"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit } from "lucide-react";
import type { PromptTest } from "@/lib/db/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PromptTestViewProps = {
  test: PromptTest;
  onEdit: () => void;
};

const GUIDE_NAMES = {
  guide1Output: "A Respectable Woman",
  guide2Output: "Teaching Critical Thinking",
  guide3Output: "The Corrections",
};

export function PromptTestView({ test, onEdit }: PromptTestViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{test.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span>Model: {test.model}</span>
            {test.iteration && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
                {test.iteration}
              </span>
            )}
            <span>
              Updated: {new Date(test.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button onClick={onEdit} variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Settings */}
      {test.settings && (
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Settings & Parameters</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {test.settings.temperature !== undefined && (
              <div>
                <span className="text-muted-foreground">Temperature:</span>{" "}
                <span className="font-medium">{test.settings.temperature}</span>
              </div>
            )}
            {test.settings.maxTokens !== undefined && (
              <div>
                <span className="text-muted-foreground">Max Tokens:</span>{" "}
                <span className="font-medium">{test.settings.maxTokens}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Prompt */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">AI Prompt</h2>
        <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap font-mono">
          {test.prompt}
        </pre>
      </Card>

      {/* Test Outputs */}
      <div className="space-y-4">
        <h2 className="font-semibold">Test Outputs</h2>

        {(["guide1Output", "guide2Output", "guide3Output"] as const).map(
          (key) => {
            const output = test[key];
            if (!output) return null;

            return (
              <Card key={key} className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    Guide {key.charAt(5)}
                  </span>
                  {GUIDE_NAMES[key]}
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {output}
                  </ReactMarkdown>
                </div>
              </Card>
            );
          }
        )}

        {!test.guide1Output && !test.guide2Output && !test.guide3Output && (
          <Card className="p-8 text-center text-muted-foreground">
            <p>No test outputs recorded yet.</p>
            <p className="text-sm mt-1">
              Click "Edit" to add outputs from your tests.
            </p>
          </Card>
        )}
      </div>

      {/* Commentary */}
      {test.commentary && (
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Commentary & Notes</h2>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {test.commentary}
            </ReactMarkdown>
          </div>
        </Card>
      )}
    </div>
  );
}
