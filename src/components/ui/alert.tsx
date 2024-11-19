import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        danger: "border-red-500/50 text-red-900 dark:border-red-500 [&>svg]:text-red-500 bg-red-50",
        warning: "border-yellow-500/50 text-yellow-900 dark:border-yellow-500 [&>svg]:text-yellow-500 bg-yellow-50",
        info: "border-blue-500/50 text-blue-900 dark:border-blue-500 [&>svg]:text-blue-500 bg-blue-50",
        destructive: "border-red-700 text-red-800 bg-red-100 dark:border-red-700 dark:text-red-300",
        error: "border-red-500/50 text-red-900 dark:border-red-500 bg-red-50", // Add this line
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant, ...props }, ref) => (
        <div
        ref={ref}
        role="alert"
        className={alertVariants({ variant, className })}
        {...props}
        />
    )
    )
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={`mb-1 font-medium leading-none tracking-tight ${className}`}
        {...props}
    />
    ))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`text-sm [&_p]:leading-relaxed ${className}`}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }