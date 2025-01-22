import { useState, useEffect } from "react";

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const useQuickFill = (fieldId: string) => {
  const [companyInfo, setCompanyInfo] = useState<string | null>(null);
  const [previousEntries, setPreviousEntries] = useState<string[]>([]);

  useEffect(() => {
    // Load company info from localStorage
    const storedCompanyInfo = localStorage.getItem("companyInfo");
    if (storedCompanyInfo) {
      const info: CompanyInfo = JSON.parse(storedCompanyInfo);
      // Map field IDs to company info fields
      const companyInfoMap: { [key: string]: keyof CompanyInfo } = {
        companyName: "name",
        address: "address",
        contactPhone: "phone",
        contactEmail: "email",
      };

      if (fieldId in companyInfoMap) {
        setCompanyInfo(info[companyInfoMap[fieldId as keyof typeof companyInfoMap]]);
      }
    }

    // Load previous entries from localStorage
    const storedSSSPs = localStorage.getItem("sssps");
    if (storedSSSPs) {
      const sssps = JSON.parse(storedSSSPs);
      const entries = sssps
        .map((sssp: any) => sssp[fieldId])
        .filter((entry: any) => entry && typeof entry === "string");
      setPreviousEntries(Array.from(new Set(entries)));
    }
  }, [fieldId]);

  const getSuggestion = async () => {
    // This is a placeholder for AI integration
    // In a real implementation, this would call an AI service
    return "AI suggested content for " + fieldId;
  };

  return {
    companyInfo,
    previousEntries,
    getSuggestion,
  };
};