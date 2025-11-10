"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, Github } from "lucide-react";

const slides = [
  {
    title: "AI-Powered Lesson Plan Generator",
    subtitle: "Transforming SuperSummary Study Guides into Ready-to-Use Lesson Plans",
    content: (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            An intelligent system that leverages AI to transform SuperSummary study guides
            into comprehensive lesson plans for educators.
          </p>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-6 text-center">Technology Stack</h3>
          <div className="space-y-4 text-lg max-w-2xl mx-auto">
            <div className="flex items-start">
              <span className="text-primary mr-3">•</span>
              <p><strong>Frontend:</strong> Next.js 15, React, TypeScript, TailwindCSS</p>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3">•</span>
              <p><strong>AI Models:</strong> Grok Beta, Claude Sonnet 4, Gemini Flash 2.0</p>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3">•</span>
              <p><strong>Backend:</strong> Next.js API Routes, Vercel AI SDK, Drizzle ORM</p>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3">•</span>
              <p><strong>Database:</strong> PostgreSQL with prompt version tracking</p>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3">•</span>
              <p><strong>Analytics:</strong> PostHog MCP integration for usage tracking</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Why Lesson Plan Generation?",
    subtitle: "Background & Feature Selection",
    content: (
      <div className="space-y-8">
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-semibold mb-4 text-primary">Personal Experience</h3>
          <p className="text-muted-foreground text-lg">
            As a former special education teacher, I experienced firsthand how time-consuming creating
            materials and writing lesson plans can be. This is a major pain point for teachers that
            SuperSummary is uniquely positioned to solve.
          </p>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-4">Value Proposition</h3>
          <div className="space-y-3 text-lg">
            <div className="flex items-start">
              <span className="text-primary mr-3 text-xl">•</span>
              <p><strong>Saves Hours:</strong> Transforms lesson planning from hours to minutes</p>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3 text-xl">•</span>
              <p><strong>Growth Tool:</strong> Can be offered free to bring more teachers into the platform</p>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3 text-xl">•</span>
              <p><strong>Extensible:</strong> Easily built out to include state standards, custom templates, and differentiation tools</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "What the AI Does Well",
    subtitle: "Output Analysis: Strengths",
    content: (
      <div className="space-y-6">
        <Card className="p-8 bg-primary/5 border-primary/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-3xl mr-3">✓</span>
            Comprehensive Structure
          </h3>
          <p className="text-lg text-muted-foreground">
            Generates well-organized lesson plans with clear objectives, activities, and assessments
            aligned to educational best practices.
          </p>
        </Card>

        <Card className="p-8 bg-primary/5 border-primary/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-3xl mr-3">✓</span>
            Content Accuracy
          </h3>
          <p className="text-lg text-muted-foreground">
            Accurately reflects SuperSummary source material, maintaining fidelity to themes,
            characters, and literary elements.
          </p>
        </Card>

        <Card className="p-8 bg-primary/5 border-primary/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <span className="text-3xl mr-3">✓</span>
            Pedagogical Quality
          </h3>
          <p className="text-lg text-muted-foreground">
            Incorporates varied instructional strategies and Bloom's Taxonomy levels for
            effective cognitive engagement.
          </p>
        </Card>
      </div>
    ),
  },
  {
    title: "Areas for Improvement",
    subtitle: "Output Analysis: Limitations",
    content: (
      <div className="space-y-6">
        <Card className="p-8 bg-orange-500/5 border-orange-500/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-orange-600 dark:text-orange-400">
            <span className="text-3xl mr-3">⚠</span>
            Context Awareness
          </h3>
          <p className="text-lg text-muted-foreground">
            Lacks awareness of classroom realities—class size, student demographics, and
            available resources need to be factored in.
          </p>
        </Card>

        <Card className="p-8 bg-orange-500/5 border-orange-500/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-orange-600 dark:text-orange-400">
            <span className="text-3xl mr-3">⚠</span>
            Differentiation Depth
          </h3>
          <p className="text-lg text-muted-foreground">
            Specific scaffolds for ELL, special education, and gifted students need more
            detailed, actionable strategies.
          </p>
        </Card>

        <Card className="p-8 bg-orange-500/5 border-orange-500/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center text-orange-600 dark:text-orange-400">
            <span className="text-3xl mr-3">⚠</span>
            Assessment Specificity
          </h3>
          <p className="text-lg text-muted-foreground">
            Would benefit from specific rubrics, sample questions, and clear success criteria
            rather than broad suggestions.
          </p>
        </Card>
      </div>
    ),
  },
  {
    title: "Next Steps to Production",
    subtitle: "Building a Market-Ready Product",
    content: (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-6 text-primary">Strategic Approach</h3>
          <div className="space-y-4 text-lg">
            <div className="flex items-start">
              <span className="text-primary mr-3 text-2xl">1.</span>
              <div>
                <strong>Start Regional:</strong> Target New York State first—leverage local teacher
                network for testing and feedback, align with NY standards
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3 text-2xl">2.</span>
              <div>
                <strong>Build Templates:</strong> Create customizable lesson plan templates that match
                common formats teachers already use in their schools
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3 text-2xl">3.</span>
              <div>
                <strong>Focus on Differentiation:</strong> Make this the standout feature—robust tools
                for ELL, special education, and gifted students become the sticky differentiator
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-xl font-semibold mb-6 text-primary">Key Safeguards</h3>
          <div className="space-y-4 text-lg">
            <div className="flex items-start">
              <span className="text-primary mr-3">•</span>
              <p><strong>Teacher Review Loop:</strong> All generated content flagged for teacher review before classroom use</p>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3">•</span>
              <p><strong>Standards Alignment:</strong> Automated verification system ensures generated plans match state standards</p>
            </div>
            <div className="flex items-start">
              <span className="text-primary mr-3">•</span>
              <p><strong>Quality Metrics:</strong> Track teacher edits and ratings to continuously improve prompt quality</p>
            </div>
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
          <div className="flex items-center gap-4">
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
            <div className="text-sm text-muted-foreground">
              Slide {currentSlide + 1} of {slides.length}
            </div>
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
