import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { MoveRight, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-extrabold text-primary animate-pulse">404</h1>
        <h2 className="text-3xl font-bold text-foreground">Oops! Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We&apos;re sorry, but the page you&apos;re looking for seems to have vanished into the digital abyss.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild variant="default">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact" className="flex items-center gap-2">
              Contact Us
              <MoveRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


