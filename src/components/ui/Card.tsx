import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-border bg-surface text-foreground shadow-sm ${className || ''}`}
    {...props}
  >
    {children}
  </div>
))

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`border-b border-border px-4 py-4 ${className || ''}`} {...props}>
    {children}
  </div>
))

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`px-4 py-4 ${className || ''}`} {...props}>
    {children}
  </div>
))

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`border-t border-border px-4 py-4 ${className || ''}`} {...props}>
    {children}
  </div>
))

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({ children, className, ...props }, ref) => (
  <h3 ref={ref} className={`text-lg font-semibold ${className || ''}`} {...props}>
    {children}
  </h3>
))

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={`text-sm text-muted-foreground ${className || ''}`} {...props}>
      {children}
    </p>
  )
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardBody.displayName = 'CardBody'
CardFooter.displayName = 'CardFooter'
CardTitle.displayName = 'CardTitle'
CardDescription.displayName = 'CardDescription'

export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription }
export default Card
