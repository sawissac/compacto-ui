// Deliberately NO "use client": proves a Server Component can import these
// primitives directly without dragging a client boundary in.
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div>
      <Button>server</Button>
      <Separator />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
