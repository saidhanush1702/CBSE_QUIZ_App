// Button Component
import './Button.css'

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon: Icon,
    onClick,
    type = 'button',
    className = ''
}) {
    const baseClass = 'btn'
    const variantClass = `btn-${variant}`
    const sizeClass = `btn-${size}`
    const widthClass = fullWidth ? 'btn-full' : ''

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
        >
            {loading ? (
                <>
                    <span className="btn-spinner"></span>
                    <span>Loading...</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className="btn-icon" />}
                    {children}
                </>
            )}
        </button>
    )
}
