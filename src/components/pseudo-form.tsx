import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type * as LabelPrimitive from "@radix-ui/react-label";
import React from "react";

const PseudoFormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
  },
);
PseudoFormItem.displayName = "PseudoFormItem";

const PseudoFormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <Label ref={ref} className={cn("", className)} {...props} />;
});
PseudoFormLabel.displayName = "PseudoFormLabel";

const PseudoFormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  },
);
PseudoFormDescription.displayName = "PseudoFormDescription";

export { PseudoFormItem, PseudoFormLabel, PseudoFormDescription };
