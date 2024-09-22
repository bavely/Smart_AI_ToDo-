import axios from "axios";
import { Task, TaskStatus, TaskForm } from "../lib/tasks.types";


export async function getTasks(): Promise<Task[]> {
    const { data } = await axios.get("/api/getTasks");
    return data.data;
}

export async function handleAddTask(task: TaskForm): Promise<Task> {
    const {title, status} = task
    const { data } = await axios.post("/api/getTasks", { title, status });
    return data;
}

export async function handleTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const { data } = await axios.put("/api/getTasks", { id, status });
    return data;
}

export async function handleDeleteTask(id: number): Promise<void> {
    await axios.delete("/api/getTasks", { data: { id } });
}