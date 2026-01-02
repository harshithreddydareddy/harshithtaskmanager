import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { Task, TaskPriority } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Flag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string; icon: string }> = {
  high: { label: "High", className: "priority-high", icon: "🔴" },
  medium: { label: "Medium", className: "priority-medium", icon: "🟠" },
  low: { label: "Low", className: "priority-low", icon: "🟢" },
};

function formatDueDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d");
}

function isDueDateOverdue(dateString: string, isCompleted: boolean): boolean {
  if (isCompleted) return false;
  const date = parseISO(dateString);
  return isPast(date) && !isToday(date);
}

export function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const isOverdue = task.due_date && isDueDateOverdue(task.due_date, task.is_completed);

  return (
    <div
      className={cn(
        "group bg-card rounded-2xl p-4 shadow-card border border-border/50 transition-all duration-300 hover:shadow-soft",
        task.is_completed && "opacity-60",
        "animate-slide-up"
      )}
      style={{ animationDelay: "0.05s" }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-0.5">
          <Checkbox
            checked={task.is_completed}
            onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
            className={cn(
              "h-6 w-6 rounded-lg border-2 transition-all duration-200",
              task.is_completed
                ? "bg-success border-success data-[state=checked]:bg-success"
                : "border-muted-foreground/30 hover:border-primary"
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title & Priority */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-semibold text-foreground leading-snug",
                task.is_completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            <span
              className={cn(
                "shrink-0 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1",
                priority.className
              )}
            >
              <Flag className="w-3 h-3" />
              {priority.label}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={cn(
                "text-sm text-muted-foreground line-clamp-2",
                task.is_completed && "line-through"
              )}
            >
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {/* Due Date */}
            {task.due_date && (
              <span
                className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-destructive font-semibold"
                )}
              >
                <Calendar className="w-3.5 h-3.5" />
                {isOverdue && "Overdue: "}
                {formatDueDate(task.due_date)}
              </span>
            )}

            {/* Created time */}
            <span className="flex items-center gap-1 opacity-70">
              <Clock className="w-3.5 h-3.5" />
              {format(parseISO(task.created_at), "MMM d")}
            </span>
          </div>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
