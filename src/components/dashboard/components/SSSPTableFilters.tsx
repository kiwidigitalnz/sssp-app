
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "../hooks/useSSSPTable";

interface SSSPTableFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  shareFilter: string;
  onShareFilterChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function SSSPTableFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  shareFilter,
  onShareFilterChange,
  dateRange,
  onDateRangeChange
}: SSSPTableFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title or company..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={shareFilter} onValueChange={onShareFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by sharing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All SSSPs</SelectItem>
            <SelectItem value="shared">Shared</SelectItem>
            <SelectItem value="not-shared">Not Shared</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={`w-full justify-start text-left font-normal ${
                !dateRange.from && !dateRange.to ? 'text-muted-foreground' : ''
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd")
                )
              ) : (
                "Filter by date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{ 
                from: dateRange.from,
                to: dateRange.to
              }}
              onSelect={(range) => {
                onDateRangeChange({
                  from: range?.from,
                  to: range?.to
                });
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
