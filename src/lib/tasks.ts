import { supabase } from "@/integrations/supabase/client";
import { Task, CreateTaskInput } from "@/types/task";

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Map the database response to our Task type
  return (data || []).map(task => ({
    ...task,
    priority: task.priority as Task["priority"]
  }));
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: input.title,
      description: input.description || null,
      priority: input.priority || "medium",
      due_date: input.due_date || null,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    priority: data.priority as Task["priority"]
  };
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    priority: data.priority as Task["priority"]
  };
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function toggleTaskComplete(id: string, isCompleted: boolean): Promise<Task> {
  return updateTask(id, { is_completed: isCompleted });
}
