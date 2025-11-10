"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, FileText, ArrowLeft, Download } from "lucide-react";
import { PromptTestForm } from "@/components/prompt-test-form";
import { PromptTestView } from "@/components/prompt-test-view";
import type { PromptTest } from "@/lib/db/schema";

export default function PromptsPage() {
  const [tests, setTests] = useState<PromptTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<PromptTest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTest, setEditingTest] = useState<PromptTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/prompt-tests");
      if (response.ok) {
        const data = await response.json();
        setTests(data);
      }
    } catch (error) {
      console.error("Failed to fetch tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt test?")) {
      return;
    }

    try {
      const response = await fetch(`/api/prompt-tests/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTests(tests.filter((t) => t.id !== id));
        if (selectedTest?.id === id) {
          setSelectedTest(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete test:", error);
    }
  };

  const handleCreate = () => {
    setEditingTest(null);
    setShowForm(true);
  };

  const handleEdit = (test: PromptTest) => {
    setEditingTest(test);
    setShowForm(true);
  };

  const handleFormClose = (refresh?: boolean) => {
    setShowForm(false);
    setEditingTest(null);
    if (refresh) {
      fetchTests();
    }
  };

  const handleExport = () => {
    // Trigger download by opening the export endpoint
    window.open("/api/prompt-tests/export", "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Test List */}
      <div className="w-80 border-r bg-muted/10 p-4">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2 w-full justify-start">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chats
            </Button>
          </Link>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">Prompt Tests</h1>
            <div className="flex gap-2">
              <Button onClick={handleCreate} size="sm" className="flex-1">
                <Plus className="h-4 w-4 mr-1" />
                New Test
              </Button>
              <Button
                onClick={handleExport}
                size="sm"
                variant="outline"
                className="flex-1"
                disabled={tests.length === 0}
                title="Export all tests to CSV spreadsheet"
              >
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {tests.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No prompt tests yet.
              <br />
              Create your first test!
            </div>
          ) : (
            tests.map((test) => (
              <Card
                key={test.id}
                className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                  selectedTest?.id === test.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedTest(test)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{test.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {test.model}
                      </span>
                      {test.iteration && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          {test.iteration}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(test.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(test);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(test.id);
                      }}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {selectedTest ? (
          <PromptTestView test={selectedTest} onEdit={() => handleEdit(selectedTest)} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileText className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">Select a prompt test to view details</p>
            <p className="text-sm">or create a new one to get started</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <PromptTestForm
          test={editingTest}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
