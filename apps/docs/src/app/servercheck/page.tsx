// Deliberately NO "use client": proves a Server Component can import the
// server-safe primitives from the barrel without dragging a client boundary in.
import { Button, Separator, Skeleton } from "@compacto/ui";

export default function Page() {
  return (
    <div>
      <Button>server</Button>
      <Separator />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
