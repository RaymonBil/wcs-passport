import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        cyan: "border-neon-cyan/40 bg-neon-cyan/10 text-cyan-300",
        magenta: "border-neon-magenta/40 bg-neon-magenta/10 text-fuchsia-300",
        glass: "border-white/15 bg-white/5 text-slate-200 backdrop-blur",
      },
    },
    defaultVariants: { variant: "glass" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
