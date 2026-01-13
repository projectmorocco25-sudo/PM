import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, TrendingUp, Truck, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">PM</span>
            </div>
            <span className="text-xl font-bold">PM Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Pharmaceutical Governance{' '}
            <span className="text-primary">Value Chain Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive regulatory compliance and supply chain monitoring for the 
            pharmaceutical industry. Ensuring medicine availability and market integrity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign in to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Governance Modules
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Shield}
              title="RMM"
              subtitle="Registry Management"
              description="Manage company registrations, products, and SKUs with complete audit trails."
            />
            <FeatureCard
              icon={TrendingUp}
              title="VCI"
              subtitle="Value Chain Intelligence"
              description="Monitor AAMS, MSQ, WSL submissions and threshold compliance in real-time."
            />
            <FeatureCard
              icon={Truck}
              title="ECS"
              subtitle="Export Control System"
              description="Streamlined export authorization with automated threshold calculations."
            />
            <FeatureCard
              icon={BarChart3}
              title="CMC"
              subtitle="Compliance Monitoring"
              description="Track compliance scores and generate regulatory reports."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PM Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  subtitle,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  description: string
}) {
  return (
    <div className="bg-background p-6 rounded-lg border shadow-sm">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-sm text-primary mb-2">{subtitle}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
