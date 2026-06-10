import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GenrePillProps {
    genre: string;
    /** Makes the pill a button that calls onClick */
    onClick?: () => void;
    /** Visual active / selected state */
    active?: boolean;
    className?: string;
}

export function GenrePill({ genre, onClick, active, className }: GenrePillProps) {
    const base = cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize leading-none transition-colors",
        active
            ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
        onClick &&
            "cursor-pointer hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-950 dark:hover:text-sky-300",
        className,
    );

    if (onClick) {
        return (
            <Button type="button" variant="ghost" onClick={onClick} className={base}>
                {genre}
            </Button>
        );
    }

    return <span className={base}>{genre}</span>;
}
