'use client'

/**
 * Task 1.1.1.18g: Compose Message Page
 */

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ComposeMessage } from '@/components/communications/compose-message'
import { Spinner } from '@/components/ui/loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'

function ComposeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get workflow entity context if provided
  const entityType = searchParams.get('entity_type')
  const entityId = searchParams.get('entity_id')
  const entityName = searchParams.get('entity_name')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Compose Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ComposeMessage
            onSuccess={(conversationId) => {
              router.push(`/dashboard/communications/inbox/${conversationId}`)
            }}
            onCancel={() => {
              router.push('/dashboard/communications')
            }}
            defaultWorkflowEntity={
              entityType && entityId
                ? {
                    type: entityType,
                    id: entityId,
                    name: entityName || undefined,
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default function ComposePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      }
    >
      <ComposeContent />
    </Suspense>
  )
}
