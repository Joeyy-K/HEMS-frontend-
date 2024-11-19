import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
        <button
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${
            variant === "default"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : variant === "outline"
                ? "border border-input hover:bg-accent hover:text-accent-foreground"
                : variant === "ghost"
                ? "hover:bg-accent hover:text-accent-foreground"
                : variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            } ${className}`}
            ref={ref}
            {...props}
        />
        )
    }
)

Button.displayName = "Button"