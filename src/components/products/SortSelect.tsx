import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

export type SortOption = "alphabetical" | "price-asc" | "price-desc" | "relevant";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[180px] bg-background">
        <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="alphabetical">A - Z</SelectItem>
        <SelectItem value="price-asc">Menor precio</SelectItem>
        <SelectItem value="price-desc">Mayor precio</SelectItem>
        <SelectItem value="relevant">Más relevantes</SelectItem>
      </SelectContent>
    </Select>
  );
}
