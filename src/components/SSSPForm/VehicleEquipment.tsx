import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface VehicleEquipmentProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const VehicleEquipment = ({ formData, setFormData }: VehicleEquipmentProps) => {
  const [checklistItems, setChecklistItems] = useState(formData.checklistItems || []);
  const [serviceRecords, setServiceRecords] = useState(formData.serviceRecords || []);

  const addChecklistItem = () => {
    const newItems = [...checklistItems, { item: "", status: "", date: "" }];
    setChecklistItems(newItems);
    setFormData({ ...formData, checklistItems: newItems });
  };

  const addServiceRecord = () => {
    const newRecords = [...serviceRecords, { equipment: "", service: "", date: "", nextDue: "" }];
    setServiceRecords(newRecords);
    setFormData({ ...formData, serviceRecords: newRecords });
  };

  const updateFormData = () => {
    setFormData({
      ...formData,
      checklistItems,
      serviceRecords,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle and Equipment Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Pre-start Checklists</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklistItems.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.item}
                        onChange={(e) => {
                          const newItems = [...checklistItems];
                          newItems[index].item = e.target.value;
                          setChecklistItems(newItems);
                          updateFormData();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.status}
                        onChange={(e) => {
                          const newItems = [...checklistItems];
                          newItems[index].status = e.target.value;
                          setChecklistItems(newItems);
                          updateFormData();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => {
                          const newItems = [...checklistItems];
                          newItems[index].date = e.target.value;
                          setChecklistItems(newItems);
                          updateFormData();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newItems = checklistItems.filter((_, i) => i !== index);
                          setChecklistItems(newItems);
                          updateFormData();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={addChecklistItem} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Checklist Item
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Service Records</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceRecords.map((record: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={record.equipment}
                        onChange={(e) => {
                          const newRecords = [...serviceRecords];
                          newRecords[index].equipment = e.target.value;
                          setServiceRecords(newRecords);
                          updateFormData();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={record.service}
                        onChange={(e) => {
                          const newRecords = [...serviceRecords];
                          newRecords[index].service = e.target.value;
                          setServiceRecords(newRecords);
                          updateFormData();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={record.date}
                        onChange={(e) => {
                          const newRecords = [...serviceRecords];
                          newRecords[index].date = e.target.value;
                          setServiceRecords(newRecords);
                          updateFormData();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={record.nextDue}
                        onChange={(e) => {
                          const newRecords = [...serviceRecords];
                          newRecords[index].nextDue = e.target.value;
                          setServiceRecords(newRecords);
                          updateFormData();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newRecords = serviceRecords.filter((_, i) => i !== index);
                          setServiceRecords(newRecords);
                          updateFormData();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={addServiceRecord} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Service Record
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Defect Reporting</h3>
            <Textarea
              placeholder="Document defect reporting procedures and corrective actions..."
              value={formData.defectReporting || ""}
              onChange={(e) => setFormData({ ...formData, defectReporting: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};