import { useEffect, useState, type ReactNode } from 'react'
import { verifyAdminAccess } from '../../lib/api/auth'
import Button from '../../components/ui/Button'
import { AdminAccessDenied } from './index'

interface AdminAccessGateProps {
  children: ReactNode
}

export function AdminAccessGate({ children }: AdminAccessGateProps) {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied' | 'error'>('checking')

  useEffect(() => {
    let isCurrentAttempt = true
    setStatus('checking')

    verifyAdminAccess()
      .then((isAdmin) => {
        if (isCurrentAttempt) {
          setStatus(isAdmin ? 'allowed' : 'denied')
        }
      })
      .catch(() => {
        if (isCurrentAttempt) {
          setStatus('error')
        }
      })

    return () => {
      isCurrentAttempt = false
    }
  }, [attempt])

  if (status === 'checking') {
    return (
      <main className="mx-auto max-w-xl p-6 text-sm text-muted-foreground" role="status">
        Verifying admin access...
      </main>
    )
  }

  if (status === 'denied') {
    return (
      <main className="p-6">
        <AdminAccessDenied />
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="mx-auto max-w-xl space-y-4 p-6" role="alert">
        <p className="text-sm text-destructive">
          Unable to verify admin access. Please retry or sign in again.
        </p>
        <Button variant="secondary" onClick={() => setAttempt((current) => current + 1)}>
          Retry
        </Button>
      </main>
    )
  }

  return <>{children}</>
}

export default AdminAccessGate
