"use client";

import { Info } from "lucide-react";
import { isDemoMode } from "@/lib/constants";

export function DemoBanner() {
	// Only show in demo mode
	if (!isDemoMode) {
		return null;
	}

	return (
		<div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2">
			<div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
				<Info className="h-4 w-4 flex-shrink-0" />
				<p>
					<strong>Demo Mode:</strong> This app is running in demo mode with
					mock responses. No API tokens are being used. Responses generate
					instantly for demonstration purposes.
				</p>
			</div>
		</div>
	);
}
