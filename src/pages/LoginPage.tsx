import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Card, { CardBody, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import Input from '../components/ui/Input'
import { registerUser } from '../lib/api/auth'

interface LoginPageProps {
  returnPath?: string | null
  // eslint-disable-next-line no-unused-vars
  onLoginSuccess: (destination: string) => void
}

function safeReturnPath(destinationPath: string | null | undefined): string {
  if (!destinationPath || !destinationPath.startsWith('/') || destinationPath.startsWith('//') || destinationPath.startsWith('/login')) {
    return '/'
  }

  return destinationPath
}

export default function LoginPage({ returnPath, onLoginSuccess }: LoginPageProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const destination = safeReturnPath(returnPath)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === 'register') {
        await registerUser({
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password,
          ...(phone.trim() ? { phone: phone.trim() } : {}),
        })
        setRegistrationComplete(true)
      } else {
        await login({ email: email.trim(), password })
        onLoginSuccess(destination)
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : `Unable to ${mode === 'register' ? 'register' : 'log in'}.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === 'register' ? 'Create your account' : 'Log in'}</CardTitle>
          <CardDescription>
            {mode === 'register'
              ? 'Register as a customer. You will need to verify your email before signing in.'
              : 'Use your account email and password. Admin access is granted by the backend based on your account role.'}
          </CardDescription>
        </CardHeader>
        <CardBody>
          {registrationComplete ? (
            <div className="space-y-4">
              <p role="status" className="rounded-md border border-border bg-muted p-3 text-sm text-foreground">
                Account created. Check your email to verify your account before logging in.
              </p>
              <Button type="button" onClick={() => {
                setRegistrationComplete(false)
                setMode('login')
              }}>
                Back to log in
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
              {mode === 'register' && (
                <>
                  <Input
                    id="register-first-name"
                    label="First name"
                    autoComplete="given-name"
                    minLength={2}
                    maxLength={100}
                    required
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                  <Input
                    id="register-last-name"
                    label="Last name"
                    autoComplete="family-name"
                    minLength={2}
                    maxLength={100}
                    required
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </>
              )}
              <Input
                id="login-email"
                label="Email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {mode === 'register' && (
                <Input
                  id="register-phone"
                  label="Phone (optional)"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              )}
              <Input
                id="login-password"
                label="Password"
                type="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                minLength={mode === 'register' ? 8 : undefined}
                maxLength={mode === 'register' ? 255 : undefined}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {error && (
                <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <a className="text-sm text-primary underline" href="/">
                  Back to products
                </a>
                <Button type="submit" isLoading={isSubmitting}>
                  {mode === 'register' ? 'Create account' : 'Log in'}
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {mode === 'register' ? 'Already have an account?' : 'New to Sahastra Digital?'}{' '}
                <button
                  type="button"
                  className="font-medium text-primary underline"
                  onClick={() => {
                    setError(null)
                    setMode(mode === 'register' ? 'login' : 'register')
                  }}
                >
                  {mode === 'register' ? 'Log in' : 'Create an account'}
                </button>
              </p>
            </form>
          )}
        </CardBody>
      </Card>
    </main>
  )
}
