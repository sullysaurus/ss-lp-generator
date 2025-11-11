export default function VideoPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
			<div className="w-full max-w-5xl">
				<h1 className="text-3xl font-bold mb-6 text-center">
					SuperSummary Demo
				</h1>
				<div className="bg-card rounded-lg shadow-lg overflow-hidden">
					<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
						<iframe
							className="absolute top-0 left-0 w-full h-full"
							src="https://www.youtube.com/embed/LWIqgcSaV74"
							title="SuperSummary Demo"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
