// Input Component
import { forwardRef } from 'react'
import './Input.css'

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    type = 'text',
    placeholder,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`input-wrapper ${className}`}>
            {label && (
                <label className="input-label">{label}</label>
            )}
            <div className="input-container">
                {Icon && (
                    <span className="input-icon">
                        <Icon />
                    </span>
                )}
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    className={`input-field ${Icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''}`}
                    {...props}
                />
            </div>
            {error && (
                <span className="input-error-text">{error}</span>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
