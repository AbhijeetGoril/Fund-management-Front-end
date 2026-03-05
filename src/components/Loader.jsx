import React from 'react'

export const Loader = ({ 
  size = "md",
  color = "primary",
  variant = "spinner"
}) => {
  
  // Size mappings for daisyUI
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  }

  // Color mappings for daisyUI themes
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    neutral: "text-neutral",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    error: "text-error"
  }

  // Different loader variants
  if (variant === "dots") {
    return (
      <div className="py-12 flex justify-center">
        <span className={`loading loading-dots ${sizeClasses[size]} ${colorClasses[color]}`}></span>
      </div>
    )
  }

  if (variant === "ring") {
    return (
      <div className="py-12 flex justify-center">
        <span className={`loading loading-ring ${sizeClasses[size]} ${colorClasses[color]}`}></span>
      </div>
    )
  }

  if (variant === "ball") {
    return (
      <div className="py-12 flex justify-center">
        <span className={`loading loading-ball ${sizeClasses[size]} ${colorClasses[color]}`}></span>
      </div>
    )
  }

  // Default spinner
  return (
    <div className="py-12 flex justify-center">
      <span className={`loading loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}></span>
    </div>
  )
}