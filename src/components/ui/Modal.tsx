import React, { useEffect, useRef } from 'react'

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, footer, className, ...props }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!isOpen) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      const handleClickOutside = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
      <div
        ref={ref}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className || ''}`}
        {...props}
      >
        <div
          ref={contentRef}
          className="relative max-h-screen w-full max-w-lg overflow-auto rounded-lg border border-border bg-surface p-6 shadow-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {title && (
            <h2 id="modal-title" className="mb-4 text-lg font-semibold text-foreground">
              {title}
            </h2>
          )}
          <div className="text-foreground">{children}</div>
          {footer && <div className="mt-6 border-t border-border pt-4">{footer}</div>}
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

export default Modal
