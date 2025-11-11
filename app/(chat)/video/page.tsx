export default function VideoPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
			<div className="w-full max-w-5xl">
				<h1 className="text-3xl font-bold mb-6 text-center">
					SuperSummary Demo
				</h1>
				<div className="bg-card rounded-lg shadow-lg overflow-hidden">
					<video
						controls
						className="w-full"
						preload="metadata"
					>
						<source src="/SuperSummary.mp4" type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				</div>
			</div>
		</div>
	);
}
