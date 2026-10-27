export type Role = 'admin' | 'member';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  admin_id: number | null;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  assigned_to: number;
  assignee?: { id: number; name: string; email: string };
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}

export interface DashboardData {
  members_count: number;
  tasks_total: number;
  tasks_by_status: Record<TaskStatus, number>;
}

/** The result of a form action (login, register, ...). */
export type FormState = {
  error?: string; // a message for the whole form
  fieldErrors?: Record<string, string[]>; // messages for single fields
  values?: Record<string, string>; // what the user typed, so the form does not go empty
};
