import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, disabled, children, className, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50',
      secondary: 'bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50',
      destructive: 'bg-destructive text-primary-foreground hover:bg-destructive/90 disabled:opacity-50',
      ghost: 'bg-transparent text-foreground hover:bg-muted disabled:opacity-50',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
        {...props}
      >
        {isLoading ? <span className="animate-spin mr-2">⌛</span> : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
