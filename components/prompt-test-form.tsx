"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PromptTest } from "@/lib/db/schema";

const MODELS = [
  { value: "grok", label: "Grok" },
  { value: "claude", label: "Claude Sonnet 4.5" },
  { value: "gemini", label: "Gemini 2.0 Flash" },
];

type PromptTestFormProps = {
  test: PromptTest | null;
  onClose: (refresh?: boolean) => void;
};

export function PromptTestForm({ test, onClose }: PromptTestFormProps) {
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [formData, setFormData] = useState({
    title: test?.title || "",
    prompt: test?.prompt || "",
    model: test?.model || "grok",
    temperature: test?.settings?.temperature?.toString() || "0.7",
    maxTokens: test?.settings?.maxTokens?.toString() || "4096",
    iteration: test?.iteration || "",
    guide1Output: test?.guide1Output || "",
    guide2Output: test?.guide2Output || "",
    guide3Output: test?.guide3Output || "",
    commentary: test?.commentary || "",
  });

  const handleRunTest = async () => {
    if (!formData.prompt || !formData.model) {
      alert("Please enter a prompt and select a model first");
      return;
    }

    setRunning(true);

    try {
      const response = await fetch("/api/prompt-tests/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: formData.prompt,
          model: formData.model,
          temperature: parseFloat(formData.temperature),
          maxTokens: parseInt(formData.maxTokens),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Auto-populate the guide outputs
        setFormData({
          ...formData,
          guide1Output: data.results[0]?.output || "",
          guide2Output: data.results[1]?.output || "",
          guide3Output: data.results[2]?.output || "",
        });
      } else {
        console.error("Failed to run test");
        alert("Failed to run test. Please try again.");
      }
    } catch (error) {
      console.error("Error running test:", error);
      alert("Error running test. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        prompt: formData.prompt,
        model: formData.model,
        settings: {
          temperature: parseFloat(formData.temperature),
          maxTokens: parseInt(formData.maxTokens),
        },
        iteration: formData.iteration || undefined,
        guide1Output: formData.guide1Output || undefined,
        guide2Output: formData.guide2Output || undefined,
        guide3Output: formData.guide3Output || undefined,
        commentary: formData.commentary || undefined,
      };

      const url = test
        ? `/api/prompt-tests/${test.id}`
        : "/api/prompt-tests";
      const method = test ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onClose(true);
      } else {
        console.error("Failed to save prompt test");
      }
    } catch (error) {
      console.error("Error saving prompt test:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {test ? "Edit Prompt Test" : "Create New Prompt Test"}
          </DialogTitle>
          <DialogDescription>
            Document your prompt engineering work for the lesson plan generator.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="E.g., Initial Lesson Plan Prompt - Version 1"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="model">Model *</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) =>
                    setFormData({ ...formData, model: value })
                  }
                >
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="iteration">Iteration</Label>
                <Input
                  id="iteration"
                  value={formData.iteration}
                  onChange={(e) =>
                    setFormData({ ...formData, iteration: e.target.value })
                  }
                  placeholder="v1, v2, final"
                />
              </div>
            </div>
          </div>

          {/* Prompt */}
          <div className="grid gap-2">
            <Label htmlFor="prompt">AI Prompt *</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Enter the full prompt you're testing..."
              className="min-h-[150px] font-mono text-sm"
              required
            />
          </div>

          {/* Run Test Button */}
          <div className="flex justify-center py-4">
            <Button
              type="button"
              onClick={handleRunTest}
              disabled={running || !formData.prompt || !formData.model}
              className="w-full max-w-md"
              variant="secondary"
            >
              {running ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Running test across all 3 guides...
                </>
              ) : (
                "🚀 Run Automated Test"
              )}
            </Button>
          </div>

          {/* Test Outputs */}
          <div className="space-y-4">
            <h3 className="font-medium">Test Outputs {running && "(Running...)"}</h3>

            <div className="grid gap-2">
              <Label htmlFor="guide1Output">Guide 1: A Respectable Woman</Label>
              <Textarea
                id="guide1Output"
                value={formData.guide1Output}
                onChange={(e) =>
                  setFormData({ ...formData, guide1Output: e.target.value })
                }
                placeholder="Paste the generated output for this guide..."
                className="min-h-[100px] text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="guide2Output">Guide 2: Teaching Critical Thinking</Label>
              <Textarea
                id="guide2Output"
                value={formData.guide2Output}
                onChange={(e) =>
                  setFormData({ ...formData, guide2Output: e.target.value })
                }
                placeholder="Paste the generated output for this guide..."
                className="min-h-[100px] text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="guide3Output">Guide 3: The Corrections</Label>
              <Textarea
                id="guide3Output"
                value={formData.guide3Output}
                onChange={(e) =>
                  setFormData({ ...formData, guide3Output: e.target.value })
                }
                placeholder="Paste the generated output for this guide..."
                className="min-h-[100px] text-sm"
              />
            </div>
          </div>

          {/* Commentary */}
          <div className="grid gap-2">
            <Label htmlFor="commentary">Commentary & Notes</Label>
            <Textarea
              id="commentary"
              value={formData.commentary}
              onChange={(e) =>
                setFormData({ ...formData, commentary: e.target.value })
              }
              placeholder="Document your reasoning, what went well, areas for improvement, etc..."
              className="min-h-[120px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : test ? "Update Test" : "Create Test"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
