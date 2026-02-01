// Card Component
import './Card.css'

export default function Card({
    children,
    variant = 'default',
    hover = false,
    padding = true,
    className = '',
    onClick
}) {
    const baseClass = 'card-component'
    const variantClass = `card-${variant}`
    const hoverClass = hover ? 'card-hoverable' : ''
    const paddingClass = padding ? 'card-padded' : ''
    const clickableClass = onClick ? 'card-clickable' : ''

    return (
        <div
            onClick={onClick}
            className={`${baseClass} ${variantClass} ${hoverClass} ${paddingClass} ${clickableClass} ${className}`}
        >
            {children}
        </div>
    )
}

// Card subcomponents
Card.Header = function CardHeader({ children, className = '' }) {
    return <div className={`card-header ${className}`}>{children}</div>
}

Card.Body = function CardBody({ children, className = '' }) {
    return <div className={`card-body ${className}`}>{children}</div>
}

Card.Footer = function CardFooter({ children, className = '' }) {
    return <div className={`card-footer ${className}`}>{children}</div>
}
