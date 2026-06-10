import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface SortOption {
    value: string;
    label: string;
}

interface SortSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    options: SortOption[];
    className?: string;
}

export function SortSelect({ value, onValueChange, options, className }: SortSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={cn("gap-1.5", className)}>
                <ArrowUpDown className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0" />
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
