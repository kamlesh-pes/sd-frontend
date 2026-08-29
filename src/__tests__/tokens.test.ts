import { tokens } from '../styles/tokens'

it('exports the shared design tokens', () => {
  expect(tokens.colors.primary).toBe('hsl(173 80% 32%)')
  expect(tokens.radius.md).toBe('0.5rem')
})