import { ArrowLeft } from "lucide-react"

export const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center dot-grid">
            <p className="text-7xl md:text-8xl font-bold text-primary">404</p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-4">
                Page not found
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <a href="/" className="cosmic-button gap-2 mt-8">
                <ArrowLeft size={16} /> Back home
            </a>
        </div>
    )
}
