import { Task, TaskPriority } from "@/types/task";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Calendar, Flag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOption = "created" | "due_date" | "priority";
export type FilterOption = "all" | "pending" | "completed";

interface TaskFiltersProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "created", label: "Newest", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { value: "due_date", label: "Due Date", icon: <Calendar className="w-3.5 h-3.5" /> },
  { value: "priority", label: "Priority", icon: <Flag className="w-3.5 h-3.5" /> },
];

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Done" },
];

export function TaskFilters({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Filter Pills */}
      <div className="flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
              filterBy === option.value
                ? "gradient-primary text-primary-foreground shadow-soft"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
          <ArrowUpDown className="w-3 h-3" />
          Sort:
        </span>
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shrink-0",
              sortBy === option.value
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Utility functions for sorting and filtering
export function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "created":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "due_date":
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      case "priority":
        const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      default:
        return 0;
    }
  });
}

export function filterTasks(tasks: Task[], filterBy: FilterOption): Task[] {
  switch (filterBy) {
    case "pending":
      return tasks.filter((t) => !t.is_completed);
    case "completed":
      return tasks.filter((t) => t.is_completed);
    default:
      return tasks;
  }
}
