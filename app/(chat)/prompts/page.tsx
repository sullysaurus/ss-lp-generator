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
import { ArrowLeft, Copy, Check, Save, History, Eye, Edit2, CheckCircle, Trash2, Github } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPromptContent, setNewPromptContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [versionName, setVersionName] = useState<string | null>(null);

  const [saveFormData, setSaveFormData] = useState({
    notes: "",
    setActive: true,
  });

  const [editingVersion, setEditingVersion] = useState<PromptVersion | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

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
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying prompt:", error);
      alert("Failed to copy prompt");
    }
  };

  const getNextVersionNumber = () => {
    if (versions.length === 0) return "v1";

    // Find the highest version number
    const versionNumbers = versions
      .map(v => {
        const match = v.version.match(/^v(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);

    const maxVersion = versionNumbers.length > 0 ? Math.max(...versionNumbers) : 0;
    return `v${maxVersion + 1}`;
  };

  const handleCreateNewVersion = () => {
    setNewPromptContent(prompt);
    setShowCreateDialog(true);
  };

  const handleSaveNewVersion = async () => {
    setSaving(true);
    try {
      const nextVersion = getNextVersionNumber();
      const response = await fetch("/api/prompt-versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: nextVersion,
          prompt: newPromptContent,
          notes: saveFormData.notes || null,
          isActive: saveFormData.setActive,
        }),
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setSaveFormData({ notes: "", setActive: true });
        setNewPromptContent("");
        await fetchPrompt();
        await fetchVersions();
        alert(`Version ${nextVersion} saved successfully!`);
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

  const handleEditVersion = (version: PromptVersion) => {
    setEditingVersion(version);
    setShowEditDialog(true);
    setShowVersionDialog(false);
  };

  const handleSaveEditedVersion = async () => {
    if (!editingVersion) return;

    try {
      const response = await fetch(`/api/prompt-versions/${editingVersion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: editingVersion.notes,
        }),
      });

      if (response.ok) {
        await fetchVersions();
        setShowEditDialog(false);
        setEditingVersion(null);
        alert("Version updated successfully!");
      } else {
        alert("Failed to update version");
      }
    } catch (error) {
      console.error("Error updating version:", error);
      alert("Error updating version");
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (!confirm("Are you sure you want to delete this version?")) {
      return;
    }

    try {
      const response = await fetch(`/api/prompt-versions/${versionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchPrompt();
        await fetchVersions();
        setShowVersionDialog(false);
        alert("Version deleted successfully!");
      } else {
        alert("Failed to delete version");
      }
    } catch (error) {
      console.error("Error deleting version:", error);
      alert("Error deleting version");
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
            <a
              href="https://github.com/sullysaurus/ss-lp-generator"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Github className="h-4 w-4 mr-2" />
                View Code
              </Button>
            </a>
            <Button onClick={handleCreateNewVersion} variant="default">
              <Save className="h-4 w-4 mr-2" />
              Create New Version
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Prompt */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Current Prompt</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-[600px] overflow-y-auto">
              {prompt}
            </pre>
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

      {/* Create New Version Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Version: {getNextVersionNumber()}</DialogTitle>
            <DialogDescription>
              Edit the prompt and save it as a new version. This will be automatically named {getNextVersionNumber()}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="newPrompt">Prompt Content</Label>
              <Textarea
                id="newPrompt"
                value={newPromptContent}
                onChange={(e) => setNewPromptContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Edit your prompt here..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={saveFormData.notes}
                onChange={(e) =>
                  setSaveFormData({ ...saveFormData, notes: e.target.value })
                }
                placeholder="Describe what changed in this version..."
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
              onClick={() => {
                setShowCreateDialog(false);
                setNewPromptContent("");
                setSaveFormData({ notes: "", setActive: true });
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNewVersion} disabled={saving}>
              {saving ? "Saving..." : `Create ${getNextVersionNumber()}`}
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
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => selectedVersion && handleEditVersion(selectedVersion)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Notes
              </Button>
              <Button
                variant="outline"
                onClick={() => selectedVersion && handleDeleteVersion(selectedVersion.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            <div className="flex gap-2">
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
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Version Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Version Notes</DialogTitle>
            <DialogDescription>
              Update the notes for version: {editingVersion?.version}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="editNotes">Notes</Label>
              <Textarea
                id="editNotes"
                value={editingVersion?.notes || ""}
                onChange={(e) =>
                  setEditingVersion(
                    editingVersion
                      ? { ...editingVersion, notes: e.target.value }
                      : null
                  )
                }
                placeholder="Update notes about this version..."
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                setEditingVersion(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEditedVersion}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
