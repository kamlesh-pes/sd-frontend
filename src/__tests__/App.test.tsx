import { render, screen } from '@testing-library/react'
import App from '../App'

it('renders welcome text', () => {
  render(<App />)
  expect(screen.getByText(/Sahastra Digital/i)).toBeDefined()
})
