import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex h-11 w-full rounded-xl border border-[#2a2a3a] bg-[#1a1a24] px-4 py-2 text-sm text-white placeholder:text-slate-600 transition-all",
                "focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white",
                className
            )}
            {...props}
        />
    );
}

export { Input };
