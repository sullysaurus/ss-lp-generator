"use client";

import { useState, useEffect } from "react";
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
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, HelpCircle } from "lucide-react";
import type { PromptTest } from "@/lib/db/schema";

type PromptVersion = {
  id: string;
  version: string;
  prompt: string;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
};

const MODELS = [
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
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [showPromptSelector, setShowPromptSelector] = useState(false);
  const [promptVersions, setPromptVersions] = useState<PromptVersion[]>([]);
  const [formData, setFormData] = useState({
    title: test?.title || "",
    prompt: test?.prompt || "",
    model: test?.model || "claude",
    temperature: test?.settings?.temperature?.toString() || "0.7",
    maxTokens: test?.settings?.maxTokens?.toString() || "4000",
    topP: test?.settings?.topP?.toString() || "0.9",
    frequencyPenalty: test?.settings?.frequencyPenalty?.toString() || "0",
    presencePenalty: test?.settings?.presencePenalty?.toString() || "0",
    iteration: test?.iteration || "",
    guide1Output: test?.guide1Output || "",
    guide2Output: test?.guide2Output || "",
    guide3Output: test?.guide3Output || "",
    commentary: test?.commentary || "",
  });

  useEffect(() => {
    fetchPromptVersions();
  }, []);

  const fetchPromptVersions = async () => {
    try {
      const response = await fetch("/api/prompt-versions");
      if (response.ok) {
        const data = await response.json();
        setPromptVersions(data);
      }
    } catch (error) {
      console.error("Failed to fetch prompt versions:", error);
    }
  };

  const handleLoadLessonPlanPrompt = async () => {
    // Open the prompt selector dialog
    setShowPromptSelector(true);
  };

  const handleSelectPromptVersion = (version: PromptVersion | "default") => {
    if (version === "default") {
      // Load the default prompt from code
      loadDefaultPrompt();
    } else {
      // Load the selected version
      setFormData({
        ...formData,
        prompt: version.prompt,
      });
      setShowPromptSelector(false);
    }
  };

  const loadDefaultPrompt = async () => {
    setLoadingPrompt(true);
    try {
      const response = await fetch("/api/prompts/lesson-plan");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...formData,
          prompt: data.prompt,
        });
        setShowPromptSelector(false);
      } else {
        alert("Failed to load lesson plan prompt");
      }
    } catch (error) {
      console.error("Error loading prompt:", error);
      alert("Error loading lesson plan prompt");
    } finally {
      setLoadingPrompt(false);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(formData.prompt);
      alert("Prompt copied to clipboard!");
    } catch (error) {
      console.error("Error copying prompt:", error);
      alert("Failed to copy prompt");
    }
  };

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
          topP: parseFloat(formData.topP),
          frequencyPenalty: parseFloat(formData.frequencyPenalty),
          presencePenalty: parseFloat(formData.presencePenalty),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Auto-populate the guide outputs AND commentary
        setFormData({
          ...formData,
          guide1Output: data.results[0]?.output || "",
          guide2Output: data.results[1]?.output || "",
          guide3Output: data.results[2]?.output || "",
          commentary: data.commentary || "",
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
          topP: parseFloat(formData.topP),
          frequencyPenalty: parseFloat(formData.frequencyPenalty),
          presencePenalty: parseFloat(formData.presencePenalty),
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

            <div className="grid grid-cols-2 gap-4">
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

            {/* Model Parameters */}
            <div>
              <h4 className="text-sm font-medium mb-3">Model Parameters</h4>
              <TooltipProvider>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="temperature" className="text-sm">
                        Temperature
                        <span className="text-xs text-muted-foreground ml-1">(0-2)</span>
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">For Lesson Plans:</p>
                          <ul className="text-xs space-y-1">
                            <li>• <strong>0.3-0.5:</strong> Structured, standards-aligned lessons</li>
                            <li>• <strong>0.6-0.8:</strong> Balanced creativity with reliability</li>
                            <li>• <strong>0.9-1.2:</strong> Creative activities and engaging hooks</li>
                            <li>• <strong>1.3+:</strong> Experimental activities (may need editing)</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </div>
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
                    <p className="text-xs text-muted-foreground">
                      Higher = more creative, Lower = more focused
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="topP" className="text-sm">
                        Top P
                        <span className="text-xs text-muted-foreground ml-1">(0-1)</span>
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">For Lesson Plans:</p>
                          <ul className="text-xs space-y-1">
                            <li>• <strong>0.7-0.8:</strong> Focused, on-topic content</li>
                            <li>• <strong>0.85-0.95:</strong> Recommended for balanced variety</li>
                            <li>• <strong>0.95-1.0:</strong> Maximum diversity in examples</li>
                            <li className="text-muted-foreground italic mt-2">Tip: Use with lower temperature for controlled variety</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="topP"
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={formData.topP}
                      onChange={(e) =>
                        setFormData({ ...formData, topP: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Controls diversity via nucleus sampling
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="maxTokens" className="text-sm">
                        Max Tokens
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">For Lesson Plans:</p>
                          <ul className="text-xs space-y-1">
                            <li>• <strong>2000-3000:</strong> Brief, single-class lesson</li>
                            <li>• <strong>4000-6000:</strong> Standard detailed lesson plan</li>
                            <li>• <strong>8000+:</strong> Multi-day unit or comprehensive plan</li>
                            <li className="text-muted-foreground italic mt-2">Note: ~750 tokens ≈ 1 page of text</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="maxTokens"
                      type="number"
                      step="100"
                      min="100"
                      max="16000"
                      value={formData.maxTokens}
                      onChange={(e) =>
                        setFormData({ ...formData, maxTokens: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum response length
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="frequencyPenalty" className="text-sm">
                        Frequency Penalty
                        <span className="text-xs text-muted-foreground ml-1">(0-2)</span>
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">For Lesson Plans:</p>
                          <ul className="text-xs space-y-1">
                            <li>• <strong>0.0:</strong> Natural language flow (default)</li>
                            <li>• <strong>0.3-0.6:</strong> Reduce repetitive phrasing in instructions</li>
                            <li>• <strong>0.7-1.0:</strong> Force varied vocabulary throughout</li>
                            <li className="text-muted-foreground italic mt-2">Use when: Activities sound too similar</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="frequencyPenalty"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={formData.frequencyPenalty}
                      onChange={(e) =>
                        setFormData({ ...formData, frequencyPenalty: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Reduces word repetition
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="presencePenalty" className="text-sm">
                        Presence Penalty
                        <span className="text-xs text-muted-foreground ml-1">(0-2)</span>
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-semibold mb-1">For Lesson Plans:</p>
                          <ul className="text-xs space-y-1">
                            <li>• <strong>0.0:</strong> Natural topic flow (default)</li>
                            <li>• <strong>0.3-0.6:</strong> More varied activity types</li>
                            <li>• <strong>0.7-1.0:</strong> Maximum diversity in examples and approaches</li>
                            <li className="text-muted-foreground italic mt-2">Use when: Want different discussion questions or assessment methods</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="presencePenalty"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={formData.presencePenalty}
                      onChange={(e) =>
                        setFormData({ ...formData, presencePenalty: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Encourages topic diversity
                    </p>
                  </div>
                </div>
              </TooltipProvider>
            </div>
          </div>

          {/* Prompt */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="prompt">AI Prompt *</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLoadLessonPlanPrompt}
                >
                  📥 Load Prompt
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPrompt}
                  disabled={!formData.prompt}
                >
                  📋 Copy
                </Button>
              </div>
            </div>
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
            <p className="text-xs text-muted-foreground">
              Load any saved prompt version from the Prompts page, edit it as needed, then run tests to compare iterations.
            </p>
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
                  Running test & generating analysis...
                </>
              ) : (
                "🚀 Run Test & Auto-Generate Analysis"
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
                placeholder="Your lesson plan will appear here after running the test..."
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
                placeholder="Your lesson plan will appear here after running the test..."
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
                placeholder="Your lesson plan will appear here after running the test..."
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
              placeholder="Your analysis will be generated here after running the test..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              💡 Auto-generated when you run the test. Includes scores, analysis, and recommendations. Feel free to edit!
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {!test && !formData.guide1Output && !formData.guide2Output && !formData.guide3Output && (
              <p className="text-xs text-muted-foreground text-center sm:text-left w-full">
                💡 Run the test first to generate results, then save
              </p>
            )}
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  loading ||
                  (!test && !formData.guide1Output && !formData.guide2Output && !formData.guide3Output)
                }
              >
                {loading
                  ? "Saving..."
                  : test
                    ? "Update Test"
                    : "Save Test Results"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Prompt Version Selector Dialog */}
      <Dialog open={showPromptSelector} onOpenChange={setShowPromptSelector}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Prompt Version</DialogTitle>
            <DialogDescription>
              Choose a prompt version to load into your test. Select the active version, a previous version, or the default from code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {/* Default/Active Prompt */}
            <Card
              className="p-4 cursor-pointer hover:bg-accent transition-colors border-2 border-primary"
              onClick={() => handleSelectPromptVersion("default")}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Current Active Prompt</h4>
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Load the currently active lesson plan prompt
                  </p>
                </div>
              </div>
            </Card>

            {/* Saved Versions */}
            {promptVersions.length > 0 && (
              <>
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Saved Versions ({promptVersions.length})
                  </h4>
                </div>
                {promptVersions.map((version) => (
                  <Card
                    key={version.id}
                    className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                      version.isActive ? "border-2 border-primary/50" : ""
                    }`}
                    onClick={() => handleSelectPromptVersion(version)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{version.version}</h4>
                          {version.isActive && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        {version.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {version.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Created {new Date(version.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPromptSelector(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
