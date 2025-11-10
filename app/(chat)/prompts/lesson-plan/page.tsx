"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Copy, Check, Save, History, Eye, Edit2, CheckCircle, RotateCcw } from "lucide-react";

type PromptVersion = {
  id: string;
  version: string;
  prompt: string;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
};

export default function LessonPlanPromptPage() {
  const [prompt, setPrompt] = useState("");
  const [editedPrompt, setEditedPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [versionName, setVersionName] = useState<string | null>(null);

  const [saveFormData, setSaveFormData] = useState({
    version: "",
    notes: "",
    setActive: true,
  });

  useEffect(() => {
    fetchPrompt();
    fetchVersions();
  }, []);

  const fetchPrompt = async () => {
    try {
      const response = await fetch("/api/prompts/lesson-plan");
      if (response.ok) {
        const data = await response.json();
        setPrompt(data.prompt);
        setEditedPrompt(data.prompt);
        setIsCustom(data.isCustom);
        setVersionName(data.versionName);
      }
    } catch (error) {
      console.error("Failed to fetch prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const response = await fetch("/api/prompt-versions");
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
      }
    } catch (error) {
      console.error("Failed to fetch versions:", error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(isEditing ? editedPrompt : prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying prompt:", error);
      alert("Failed to copy prompt");
    }
  };

  const handleEdit = () => {
    setEditedPrompt(prompt);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedPrompt(prompt);
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const handleSaveVersion = async () => {
    if (!saveFormData.version.trim()) {
      alert("Please enter a version name");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/prompt-versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: saveFormData.version,
          prompt: editedPrompt,
          notes: saveFormData.notes || null,
          isActive: saveFormData.setActive,
        }),
      });

      if (response.ok) {
        setShowSaveDialog(false);
        setSaveFormData({ version: "", notes: "", setActive: true });
        setIsEditing(false);
        await fetchPrompt();
        await fetchVersions();
        alert("Prompt version saved successfully!");
      } else {
        alert("Failed to save prompt version");
      }
    } catch (error) {
      console.error("Error saving version:", error);
      alert("Error saving prompt version");
    } finally {
      setSaving(false);
    }
  };

  const handleViewVersion = (version: PromptVersion) => {
    setSelectedVersion(version);
    setShowVersionDialog(true);
  };

  const handleMakeActive = async (versionId: string) => {
    try {
      const response = await fetch("/api/prompt-versions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: versionId }),
      });

      if (response.ok) {
        await fetchPrompt();
        await fetchVersions();
        setShowVersionDialog(false);
        alert("Version set as active!");
      } else {
        alert("Failed to set version as active");
      }
    } catch (error) {
      console.error("Error setting active version:", error);
      alert("Error setting version as active");
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
    <div className="container max-w-6xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Lesson Plan Prompt
              {isCustom && (
                <span className="text-sm font-normal text-primary bg-primary/10 px-2 py-1 rounded">
                  Custom: {versionName}
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isCustom
                ? "Using your custom active version"
                : "Using default prompt from code"}
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button onClick={handleEdit} variant="default">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Prompt
                </Button>
                <Button onClick={handleCopy} variant="outline">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSaveClick} variant="default">
                  <Save className="h-4 w-4 mr-2" />
                  Save & Set Active
                </Button>
                <Button onClick={handleCancelEdit} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Prompt */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">
              {isEditing ? "Edit Prompt" : "Current Prompt"}
            </h3>
            {isEditing ? (
              <Textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="min-h-[600px] font-mono text-sm"
              />
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[600px] overflow-y-auto">
                {prompt}
              </pre>
            )}
          </Card>
        </div>

        {/* Version History */}
        <div>
          <Card className="p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <History className="h-4 w-4 mr-2" />
              Version History ({versions.length})
            </h3>
            <div className="space-y-2">
              {versions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No versions saved yet.
                  <br />
                  Save your first version!
                </p>
              ) : (
                versions.map((version) => (
                  <Card
                    key={version.id}
                    className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                      version.isActive ? "border-2 border-primary" : ""
                    }`}
                    onClick={() => handleViewVersion(version)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{version.version}</h4>
                          {version.isActive && (
                            <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                          )}
                        </div>
                        {version.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {version.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(version.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Save Version Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Prompt Version</DialogTitle>
            <DialogDescription>
              Save your edited prompt as a new version.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="version">Version Name *</Label>
              <Input
                id="version"
                value={saveFormData.version}
                onChange={(e) =>
                  setSaveFormData({ ...saveFormData, version: e.target.value })
                }
                placeholder="e.g., v1, v2, final"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={saveFormData.notes}
                onChange={(e) =>
                  setSaveFormData({ ...saveFormData, notes: e.target.value })
                }
                placeholder="What changed in this version..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="setActive"
                checked={saveFormData.setActive}
                onChange={(e) =>
                  setSaveFormData({ ...saveFormData, setActive: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="setActive" className="cursor-pointer">
                Set as active version (will be used in lesson plan generator)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveVersion} disabled={saving}>
              {saving ? "Saving..." : "Save Version"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedVersion?.version}
              {selectedVersion?.isActive && (
                <span className="text-sm font-normal text-primary bg-primary/10 px-2 py-1 rounded">
                  Active
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Saved on {selectedVersion && new Date(selectedVersion.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {selectedVersion?.notes && (
              <div>
                <Label>Notes:</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedVersion.notes}
                </p>
              </div>
            )}
            <div>
              <Label>Prompt:</Label>
              <Card className="p-4 mt-2">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {selectedVersion?.prompt}
                </pre>
              </Card>
            </div>
          </div>
          <DialogFooter>
            {!selectedVersion?.isActive && (
              <Button
                variant="default"
                onClick={() => selectedVersion && handleMakeActive(selectedVersion.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Set as Active
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                if (selectedVersion) {
                  navigator.clipboard.writeText(selectedVersion.prompt);
                  alert("Prompt copied to clipboard!");
                }
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Prompt
            </Button>
            <Button onClick={() => setShowVersionDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
