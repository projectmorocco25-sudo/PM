/**
 * Footer Component
 * Task: 1.1.1.15e
 * Reference: Navigation & Layout Patterns
 * 
 * Footer for public pages
 */

'use client'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Pharmaceutical Governance Platform
        </p>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <a href="/support" className="hover:text-gray-900 dark:hover:text-gray-100">
            Support
          </a>
          <a href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-100">
            Privacy
          </a>
          <a href="/terms" className="hover:text-gray-900 dark:hover:text-gray-100">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
