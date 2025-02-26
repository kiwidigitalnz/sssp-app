
import { SSSPTable } from "./SSSPTable";
import type { SSSP } from "@/types/sssp";

interface SSSPListProps {
  sssps: SSSP[];
}

export function SSSPList({ sssps }: SSSPListProps) {
  const handleRefresh = () => {
    // The parent component will handle the refresh through React Query
    window.location.reload();
  };

  return (
    <div className="rounded-md border">
      <SSSPTable sssps={sssps} onRefresh={handleRefresh} />
    </div>
  );
}
