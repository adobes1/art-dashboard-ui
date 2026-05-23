import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-2.5 py-1 text-sm font-medium transition-all duration-100 hover:brightness-110",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        success:
          "bg-green-950 text-green-400 dark:bg-green-950 dark:text-green-400 bg-green-50 text-green-700 ring-1 ring-inset ring-green-200 dark:ring-0",
        info: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:ring-0 dark:bg-blue-950 dark:text-blue-400",
        destructive:
          "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:ring-0 dark:bg-red-950 dark:text-red-400",
        warning:
          "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-200 dark:ring-0 dark:bg-yellow-950 dark:text-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
