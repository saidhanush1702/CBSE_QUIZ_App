// Timer Component
import { useEffect, useState } from 'react'
import { HiOutlineClock } from 'react-icons/hi2'
import './Timer.css'

export default function Timer({
    initialSeconds,
    onTimeUp,
    onTick,
    paused = false,
    showIcon = true,
    size = 'md',
    className = ''
}) {
    const [seconds, setSeconds] = useState(initialSeconds)

    useEffect(() => {
        setSeconds(initialSeconds)
    }, [initialSeconds])

    useEffect(() => {
        if (paused || seconds <= 0) return

        const timer = setInterval(() => {
            setSeconds((prev) => {
                const newValue = prev - 1
                if (onTick) onTick(newValue)

                if (newValue <= 0) {
                    clearInterval(timer)
                    if (onTimeUp) onTimeUp()
                    return 0
                }
                return newValue
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [paused, onTimeUp, onTick])

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const isWarning = seconds <= 60
    const isDanger = seconds <= 10

    const getStatusClass = () => {
        if (isDanger) return 'timer-danger'
        if (isWarning) return 'timer-warning'
        return 'timer-normal'
    }

    return (
        <div className={`timer timer-${size} ${getStatusClass()} ${className}`}>
            {showIcon && <HiOutlineClock className="timer-icon" />}
            <span className="timer-value">{formatTime(seconds)}</span>
        </div>
    )
}
