import { SSSP } from "@/types/sssp";

export const saveTemplate = (name: string, fields: Partial<SSSP>) => {
  const templates = getTemplates();
  const newTemplate = {
    id: Date.now().toString(),
    name,
    fields,
    createdAt: new Date().toISOString(),
  };
  
  templates.push(newTemplate);
  localStorage.setItem("sssp_templates", JSON.stringify(templates));
  return newTemplate;
};

export const getTemplates = () => {
  const templates = localStorage.getItem("sssp_templates");
  return templates ? JSON.parse(templates) : [];
};

export const deleteTemplate = (id: string) => {
  const templates = getTemplates().filter((t: any) => t.id !== id);
  localStorage.setItem("sssp_templates", JSON.stringify(templates));
};

export const getFieldHistory = (fieldId: string): string[] => {
  const sssps = localStorage.getItem("sssps");
  if (!sssps) return [];

  const parsedSSSPs = JSON.parse(sssps) as SSSP[];
  const values = parsedSSSPs
    .map(sssp => (sssp as any)[fieldId])
    .filter(value => value && typeof value === "string");
  
  return Array.from(new Set(values));
};