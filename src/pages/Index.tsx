import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks, useCreateTask, useDeleteTask, useToggleTaskComplete } from "@/hooks/useTasks";
import { Header } from "@/components/Header";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { TaskFilters, SortOption, FilterOption, sortTasks, filterTasks } from "@/components/TaskFilters";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formOpen, setFormOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("created");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Task queries
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const toggleComplete = useToggleTaskComplete();

  // Filtered and sorted tasks
  const processedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filterBy);
    return sortTasks(filtered, sortBy);
  }, [tasks, sortBy, filterBy]);

  const completedCount = tasks.filter((t) => t.is_completed).length;

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <Header taskCount={tasks.length} completedCount={completedCount} />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Card */}
        <div className="bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-5 text-primary-foreground shadow-glow animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">
                Today's Progress
              </p>
              <p className="text-3xl font-display font-bold">
                {tasks.length === 0
                  ? "Start fresh!"
                  : `${Math.round((completedCount / tasks.length) * 100)}%`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-display font-bold">{completedCount}</p>
              <p className="text-primary-foreground/80 text-sm">
                of {tasks.length} tasks
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <TaskFilters
          sortBy={sortBy}
          filterBy={filterBy}
          onSortChange={setSortBy}
          onFilterChange={setFilterBy}
        />

        {/* Task List */}
        {tasksLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground mt-4">Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={processedTasks}
            onToggleComplete={(id, isCompleted) =>
              toggleComplete.mutate({ id, isCompleted })
            }
            onDelete={(id) => deleteTask.mutate(id)}
          />
        )}
      </main>

      {/* Floating Action Button */}
      <Button
        variant="fab"
        size="fab"
        onClick={() => setFormOpen(true)}
        className="fixed bottom-6 right-6 z-50"
      >
        <Plus className="w-7 h-7" />
      </Button>

      {/* Task Form Sheet */}
      <TaskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={(data) => createTask.mutate(data)}
        isLoading={createTask.isPending}
      />
    </div>
  );
};

export default Index;
