import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image src="/next.svg" alt="MOH Logo" width={120} height={24} priority />
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/about" className="text-zinc-700 hover:text-zinc-900 hover:underline">
              About
            </Link>
            <Link href="/support" className="text-zinc-700 hover:text-zinc-900 hover:underline">
              Support
            </Link>
            <Link href="/status" className="text-zinc-700 hover:text-zinc-900 hover:underline">
              Status
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-r from-blue-700 to-blue-500 px-4 py-20 text-white">
          <div className="mx-auto max-w-screen-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Pharmaceutical Governance Value Chain Platform
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/90 md:text-2xl">
              Ensuring Medicine Availability &amp; Compliance
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white/70 text-white hover:bg-white/10">
                  Learn More →
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-sm">
              <CardHeader>
                <CardTitle>Registry Management</CardTitle>
                <CardDescription>Manage products, companies, and submissions.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600">
                A trusted registry foundation for regulatory workflows and approvals.
              </CardContent>
            </Card>
            <Card className="hover:shadow-sm">
              <CardHeader>
                <CardTitle>Compliance Monitoring</CardTitle>
                <CardDescription>Monitor stock levels and compliance with thresholds.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600">
                Continuous visibility into reporting quality and risk signals.
              </CardContent>
            </Card>
            <Card className="hover:shadow-sm">
              <CardHeader>
                <CardTitle>Export Control</CardTitle>
                <CardDescription>Control exports to ensure domestic availability.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600">
                Authorization flows that protect national supply and governance rules.
              </CardContent>
            </Card>
            <Card className="hover:shadow-sm md:col-span-1">
              <CardHeader>
                <CardTitle>Enforcement Actions</CardTitle>
                <CardDescription>Manage warnings, fines, and suspensions.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600">
                Structured lifecycle support for investigations and regulatory enforcement.
              </CardContent>
            </Card>
            <Card className="hover:shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle>Analytics &amp; Reporting</CardTitle>
                <CardDescription>Track compliance trends and generate reports.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600">
                Auditable insights across the value chain, with governance-first metrics.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-zinc-50 px-4 py-14">
          <div className="mx-auto max-w-screen-2xl">
            <h2 className="text-2xl font-semibold text-zinc-900 md:text-3xl">About MOH&apos;s Regulatory Mission</h2>
            <p className="mt-4 max-w-3xl text-base text-zinc-700">
              The Pharmaceutical Governance Value Chain Platform supports the Ministry of Health&apos;s mission to ensure
              medicine availability and regulatory compliance across the pharmaceutical value chain.
            </p>
            <div className="mt-6">
              <Link href="/about" className="text-sm font-semibold text-blue-700 hover:underline">
                Learn More About MOH&apos;s Mission →
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-2xl px-4 py-12">
          <h2 className="text-xl font-semibold text-zinc-900 md:text-2xl">Partnership Information</h2>
          <p className="mt-3 max-w-3xl text-sm text-zinc-700">
            Developed in partnership with the Ministry of Health to support regulatory governance and compliance
            management.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/contact" className="text-blue-700 hover:underline">
              Contact Us
            </Link>
            <Link href="/about" className="text-blue-700 hover:underline">
              About
            </Link>
            <Link href="/support" className="text-blue-700 hover:underline">
              Support
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
