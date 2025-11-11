"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

const GUIDES = [
	{
		id: "1",
		name: "A Respectable Woman",
		uri: "guide://guide1",
		description: "Kate Chopin short story (27 pages)",
		author: "Kate Chopin",
	},
	{
		id: "2",
		name: "Teaching Critical Thinking",
		uri: "guide://guide2",
		description: "bell hooks educational text (48 pages)",
		author: "bell hooks",
	},
	{
		id: "3",
		name: "The Corrections",
		uri: "guide://guide3",
		description: "Jonathan Franzen novel (46 pages)",
		author: "Jonathan Franzen",
	},
];

const GUIDE_OPTIONS: ComboboxOption[] = GUIDES.map((guide) => ({
	value: guide.id,
	label: guide.name,
	description: `${guide.author} - ${guide.description}`,
}));

const GRADE_LEVELS = [
	"Elementary (K-5)",
	"Middle School (6-8)",
	"High School (9-12)",
	"College/University",
];

const DURATIONS = [
	"1 class period (45-60 min)",
	"2-3 class periods",
	"1 week",
	"2 weeks",
	"1 month",
];

type GuideSelectorProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onGenerate: (prompt: string) => void;
};

export function GuideSelector({
	open,
	onOpenChange,
	onGenerate,
}: GuideSelectorProps) {
	const [selectedGuide, setSelectedGuide] = useState<string>("");
	const [gradeLevel, setGradeLevel] = useState<string>("");
	const [duration, setDuration] = useState<string>("");

	const handleGenerate = () => {
		const guide = GUIDES.find((g) => g.id === selectedGuide);
		if (!guide) return;

		const prompt = `IMPORTANT: First, use the readGuide tool to read ${guide.uri}. Then generate a comprehensive lesson plan for "${guide.name}" by ${guide.author}.

**Required Parameters:**
- Grade Level: ${gradeLevel || "Not specified"}
- Duration: ${duration || "Not specified"}

**Instructions:**
1. Call readGuide(uri="${guide.uri}") to access the full study guide content
2. Analyze the guide content thoroughly
3. Create a detailed lesson plan with learning objectives, activities, materials, assessments, and differentiation strategies
4. Ground all activities and examples in specific content from the guide

Begin by reading the guide using the readGuide tool.`;

		onGenerate(prompt);
		onOpenChange(false);

		// Reset form
		setSelectedGuide("");
		setGradeLevel("");
		setDuration("");
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Generate Lesson Plan</DialogTitle>
					<DialogDescription>
						Select a guide and customize your lesson plan parameters.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="guide">Select Guide</Label>
						<Combobox
							options={GUIDE_OPTIONS}
							value={selectedGuide}
							onValueChange={setSelectedGuide}
							placeholder="Search or select a guide..."
							searchPlaceholder="Search guides by title or author..."
							emptyText="No guides found."
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="grade">Grade Level (Optional)</Label>
						<Select value={gradeLevel} onValueChange={setGradeLevel}>
							<SelectTrigger id="grade">
								<SelectValue placeholder="Select grade level..." />
							</SelectTrigger>
							<SelectContent>
								{GRADE_LEVELS.map((level) => (
									<SelectItem key={level} value={level}>
										{level}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="duration">Duration (Optional)</Label>
						<Select value={duration} onValueChange={setDuration}>
							<SelectTrigger id="duration">
								<SelectValue placeholder="Select duration..." />
							</SelectTrigger>
							<SelectContent>
								{DURATIONS.map((dur) => (
									<SelectItem key={dur} value={dur}>
										{dur}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button onClick={handleGenerate} disabled={!selectedGuide}>
						Generate Lesson Plan
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
