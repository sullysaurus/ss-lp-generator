"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "AI-Powered Lesson Plan Generator",
    subtitle: "Transforming SuperSummary Study Guides into Actionable Educational Content",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Project Overview</h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            An intelligent system that leverages AI to transform SuperSummary study guides
            into comprehensive, standards-aligned lesson plans for educators.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">3</div>
            <div className="text-sm text-muted-foreground">AI Models</div>
            <div className="text-xs mt-1">Grok, Claude, Gemini</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">30+</div>
            <div className="text-sm text-muted-foreground">Test Iterations</div>
            <div className="text-xs mt-1">With versioning system</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Automated</div>
            <div className="text-xs mt-1">End-to-end workflow</div>
          </Card>
        </div>
      </div>
    ),
  },
  {
    title: "Feature Selection",
    subtitle: "Why Lesson Plan Generation?",
    content: (
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">Value to SuperSummary Users</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <strong>Saves Time:</strong> Reduces lesson planning from hours to minutes
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <strong>Standards-Aligned:</strong> Automatically incorporates Common Core standards
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <strong>Differentiated:</strong> Generates activities for multiple learning levels
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <strong>Assessment-Ready:</strong> Includes formative and summative assessments
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">Business Value to SuperSummary</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <strong>Premium Feature:</strong> Justifies teacher/institutional subscriptions
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <strong>Market Differentiation:</strong> Unique offering vs. competitors
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <strong>Increased Engagement:</strong> Deeper platform usage and retention
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <div>
                <strong>Data Insights:</strong> Understanding educator needs and usage patterns
              </div>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Output Analysis: Strengths",
    subtitle: "What the AI Does Well",
    content: (
      <div className="space-y-6">
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="text-2xl mr-2">✓</span>
            Comprehensive Structure
          </h3>
          <p className="text-muted-foreground">
            AI consistently generates well-organized lesson plans with clear learning objectives,
            activities, and assessments aligned to educational best practices.
          </p>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="text-2xl mr-2">✓</span>
            Content Accuracy
          </h3>
          <p className="text-muted-foreground">
            Generated content accurately reflects the source material from SuperSummary guides,
            maintaining fidelity to themes, characters, and literary elements.
          </p>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="text-2xl mr-2">✓</span>
            Pedagogical Quality
          </h3>
          <p className="text-muted-foreground">
            Activities incorporate varied instructional strategies (think-pair-share, gallery walks,
            Socratic seminars) and Bloom's Taxonomy levels for cognitive engagement.
          </p>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="text-2xl mr-2">✓</span>
            Model Consistency
          </h3>
          <p className="text-muted-foreground">
            All three AI models (Grok, Claude, Gemini) produce similar quality output,
            demonstrating robust prompt engineering.
          </p>
        </Card>
      </div>
    ),
  },
  {
    title: "Output Analysis: Limitations",
    subtitle: "Areas for Improvement",
    content: (
      <div className="space-y-6">
        <Card className="p-6 bg-orange-500/5 border-orange-500/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-orange-600 dark:text-orange-400">
            <span className="text-2xl mr-2">⚠</span>
            Context Awareness
          </h3>
          <p className="text-muted-foreground">
            AI lacks awareness of classroom realities (class size, student demographics,
            available resources) and generates generic time allocations without considering practical constraints.
          </p>
        </Card>

        <Card className="p-6 bg-orange-500/5 border-orange-500/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-orange-600 dark:text-orange-400">
            <span className="text-2xl mr-2">⚠</span>
            Differentiation Depth
          </h3>
          <p className="text-muted-foreground">
            While differentiation is mentioned, specific scaffolds for ELL, special education,
            or gifted students need more detailed, actionable strategies.
          </p>
        </Card>

        <Card className="p-6 bg-orange-500/5 border-orange-500/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-orange-600 dark:text-orange-400">
            <span className="text-2xl mr-2">⚠</span>
            Assessment Specificity
          </h3>
          <p className="text-muted-foreground">
            Assessment suggestions are broad. Teachers would benefit from specific rubrics,
            sample questions, and clear success criteria.
          </p>
        </Card>

        <Card className="p-6 bg-orange-500/5 border-orange-500/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-orange-600 dark:text-orange-400">
            <span className="text-2xl mr-2">⚠</span>
            Creative Variability
          </h3>
          <p className="text-muted-foreground">
            Repeated generations can produce similar activities. More randomization or
            teacher preferences could increase variety.
          </p>
        </Card>
      </div>
    ),
  },
  {
    title: "Technical Implementation",
    subtitle: "System Architecture & Features",
    content: (
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">Core Features Built</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <div>
                <strong>MCP Integration:</strong> PostHog analytics for usage tracking
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <div>
                <strong>Multi-Model Support:</strong> Grok, Claude Sonnet, Gemini Flash
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <div>
                <strong>Prompt Testing:</strong> CRUD interface for rapid iteration
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <div>
                <strong>Version Control:</strong> Track and compare prompt iterations
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <div>
                <strong>Live Editing:</strong> UI-based prompt modification
              </div>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">Technical Stack</h3>
          <Card className="p-4 mb-3">
            <div className="font-semibold mb-2">Frontend</div>
            <div className="text-sm text-muted-foreground">
              Next.js 15, React, TailwindCSS, TypeScript
            </div>
          </Card>
          <Card className="p-4 mb-3">
            <div className="font-semibold mb-2">Backend</div>
            <div className="text-sm text-muted-foreground">
              Next.js API Routes, Vercel AI SDK, Drizzle ORM
            </div>
          </Card>
          <Card className="p-4 mb-3">
            <div className="font-semibold mb-2">Database</div>
            <div className="text-sm text-muted-foreground">
              PostgreSQL with prompt version tracking
            </div>
          </Card>
          <Card className="p-4">
            <div className="font-semibold mb-2">AI Models</div>
            <div className="text-sm text-muted-foreground">
              Grok Beta, Claude Sonnet 4, Gemini Flash 2.0
            </div>
          </Card>
        </div>
      </div>
    ),
  },
  {
    title: "Next Steps",
    subtitle: "Roadmap to Production",
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">Immediate Refinements</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Teacher Customization</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Class period length input</li>
                <li>• Grade level specification</li>
                <li>• Student demographic data</li>
                <li>• Available resources inventory</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Enhanced Differentiation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ELL scaffolding templates</li>
                <li>• IEP accommodation suggestions</li>
                <li>• Advanced learner extensions</li>
                <li>• Multiple modality options</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Assessment Tools</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Detailed rubric generation</li>
                <li>• Example student responses</li>
                <li>• Formative check questions</li>
                <li>• Exit ticket suggestions</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Export Formats</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PDF with formatting</li>
                <li>• Google Docs integration</li>
                <li>• Editable templates</li>
                <li>• LMS-ready formats</li>
              </ul>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary">Safety & Quality Safeguards</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Content Review</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Human-in-the-loop validation</li>
                <li>• Pedagogical expert review</li>
                <li>• Accuracy verification system</li>
                <li>• Bias detection checks</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">User Feedback Loop</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Rating system for outputs</li>
                <li>• Teacher edit tracking</li>
                <li>• Usage analytics</li>
                <li>• Continuous improvement</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Performance Monitoring</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Response time tracking</li>
                <li>• Cost per generation</li>
                <li>• Model comparison metrics</li>
                <li>• Error rate monitoring</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Compliance & Privacy</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• FERPA compliance</li>
                <li>• Student data protection</li>
                <li>• Usage terms clarity</li>
                <li>• Attribution guidelines</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    ),
  },
];

export default function SlidesPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>

        {/* Slide Container */}
        <Card className="p-8 md:p-12 min-h-[600px] flex flex-col">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{slides[currentSlide].title}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {slides[currentSlide].subtitle}
            </p>
            <div className="mt-8">{slides[currentSlide].content}</div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              onClick={prevSlide}
              variant="outline"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {/* Slide Dots */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              variant="outline"
              disabled={currentSlide === slides.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Use ← → arrow keys to navigate
        </div>
      </div>
    </div>
  );
}
