export function EmptyState() {
    return (
        <div className="h-full flex items-center justify-center px-6 bg-zinc-950">
            <div className="text-center max-w-lg space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-100">
                    Recipe Assistant
                </h1>

                <p className="text-sm text-zinc-400 leading-relaxed">
                    Ask for pancakes, pasta, salads, cakes, or any recipe and I’ll help you cook it step-by-step.
                </p>

                <div className="text-xs text-zinc-500 space-y-1 mt-4">
                    <p>• Ingredients & recipes</p>
                    <p>• Cooking instructions</p>
                    <p>• Time & difficulty</p>
                </div>

                <p className="text-zinc-500 text-xs mt-4">
                    Try: “Quick Italian dinner” or “Chocolate dessert”
                </p>
            </div>
        </div>
    );
}