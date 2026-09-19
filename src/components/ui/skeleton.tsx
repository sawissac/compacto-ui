import { cn } from "@/lib/cn";

/**
 * Placeholder block shown while content loads: a rounded, tinted block with no
 * border, standing in for the hairline-bordered surfaces around it.
 *
 * Renders no text and is `aria-hidden`, so a screen reader hears the loading
 * state from whatever live region the caller owns rather than from a wall of
 * empty boxes. Size it with `className` — it has no intrinsic dimensions.
 *
 * Server-safe: no `"use client"` directive, so a Server Component can render a
 * loading shell without pulling a client boundary in with it.
 *
 * @param props.className - Extra classes merged onto the block; this is how
 *   you give it a size (`h-4 w-32`) and, if needed, a different radius.
 *
 * @example
 * ```tsx
 * <div className="flex flex-col gap-2">
 *   <Skeleton className="h-4 w-48" />
 *   <Skeleton className="h-4 w-32" />
 * </div>
 * ```
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("animate-pulse rounded-md bg-app-hover", className)}
      {...props}
    />
  );
}

export { Skeleton };
