import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from '../LoginPage'

const mockLogin = vi.fn()
const mockRegisterUser = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

vi.mock('../../lib/api/auth', () => ({
  registerUser: (...args: unknown[]) => mockRegisterUser(...args),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockReset()
    mockRegisterUser.mockReset()
  })

  it('logs in and returns to the requested internal page', async () => {
    mockLogin.mockResolvedValue(undefined)
    const onLoginSuccess = vi.fn()
    render(<LoginPage returnPath="/admin/products" onLoginSuccess={onLoginSuccess} />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'password' })
      expect(onLoginSuccess).toHaveBeenCalledWith('/admin/products')
    })
  })

  it('does not allow an external return URL', async () => {
    mockLogin.mockResolvedValue(undefined)
    const onLoginSuccess = vi.fn()
    render(<LoginPage returnPath="//attacker.example" onLoginSuccess={onLoginSuccess} />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledWith('/'))
  })

  it('shows backend login errors', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))
    render(<LoginPage onLoginSuccess={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')
  })

  it('submits the registration fields and prompts for email verification', async () => {
    mockRegisterUser.mockResolvedValue(undefined)
    render(<LoginPage onLoginSuccess={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Create an account' }))
    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText('Phone (optional)'), { target: { value: '+15551234567' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'strong-password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'strong-password',
        phone: '+15551234567',
      })
    })
    expect(await screen.findByRole('status')).toHaveTextContent(/verify your account/i)
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('omits the optional phone number when not provided', async () => {
    mockRegisterUser.mockResolvedValue(undefined)
    render(<LoginPage onLoginSuccess={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Create an account' }))
    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'strong-password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }))

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        password: 'strong-password',
      })
    })
  })
})
