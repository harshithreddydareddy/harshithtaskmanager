import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask, toggleTaskComplete } from "@/lib/tasks";
import { Task, CreateTaskInput } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task created! ✨",
        description: "Let's get it done!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't create task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task deleted",
        description: "Gone but not forgotten 👋",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't delete task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useToggleTaskComplete() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      toggleTaskComplete(id, isCompleted),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (task.is_completed) {
        toast({
          title: "Nice work! 🎉",
          description: "Task completed!",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
