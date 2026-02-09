import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500/50",
    {
        variants: {
            variant: {
                default:
                    "bg-[#4C1170] text-white shadow-lg shadow-violet-500/20 hover:bg-[#5a1d82]",
                destructive:
                    "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 focus-visible:ring-red-500/50",
                outline:
                    "border border-white/10 bg-transparent hover:bg-white/5 text-slate-300",
                secondary:
                    "bg-white/5 text-slate-300 hover:bg-white/10",
                ghost:
                    "hover:bg-white/5 text-slate-300 hover:text-white",
                link: "text-violet-400 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-5 py-2",
                sm: "h-9 rounded-lg px-3 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                icon: "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
