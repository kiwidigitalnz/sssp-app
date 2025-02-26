
import { SSSPTable } from "./SSSPTable";

interface SSSP {
  id: string;
  title: string;
  description: string;
  company_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  version: number;
}

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
