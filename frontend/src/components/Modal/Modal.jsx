// Modal Component
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HiOutlineXMark } from 'react-icons/hi2'
import './Modal.css'

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    className = ''
}) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal-content modal-${size} ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                        <button
                            onClick={onClose}
                            className="modal-close"
                            aria-label="Close modal"
                        >
                            <HiOutlineXMark />
                        </button>
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}

// Modal subcomponents
Modal.Footer = function ModalFooter({ children, className = '' }) {
    return <div className={`modal-footer ${className}`}>{children}</div>
}
