export type Task = {
  _id: number;
  title: string;
  status: TaskStatus;
};

export type TaskForm = Omit<Task, "_id">;

export enum TaskStatus {
  todo = "todo",
  done = "done",
}
