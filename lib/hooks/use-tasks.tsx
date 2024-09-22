import { createContext, useContext, useState, ReactNode, useEffect } from "react";
// import { defaultTasks } from "../default-tasks";
import { getTasks, handleAddTask, handleTaskStatus, handleDeleteTask } from "@/services/tasksServices";
//  handleAddTask, handleTaskStatus, handleDeleteTask
import { Task, TaskStatus } from "../tasks.types";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
// let nextId = defaultTasks.length + 1;

type TasksContextType = {
  tasks: Task[];
  addTask: (title: string) => void;
  setTaskStatus: (title: string, status: TaskStatus) => void;
  deleteTask: (title: string) => void;
  loading: boolean;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchTasks = async () => {
    getTasks().then((res) => {
      setTasks(res);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchTasks();
  }, []);


  useCopilotReadable({
    description: "The state of the todo list",
    value: JSON.stringify(tasks)
  });

  useCopilotAction({
    name: "addTask",
    description: "Adds a task to the todo list",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the task",
        required: true,
      },
    ],
    handler: ({ title }) => {
      addTask(title);
    },
  });
 
  useCopilotAction({
    name: "deleteTask",
    description: "Deletes a task from the todo list",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the task",
        required: true,
      },
    ],
    handler: ({ title }) => {
      deleteTask(title);
    },
  });


  useCopilotAction({
    name: "changeTaskStatus",
    description: "Changes the status of a task in the todo list",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the task",
        required: true,
      },{
        name: "status",
        type: "string",
        description: "The status of the task",
        required: true,
      }
    ],
    handler: ({ title, status }) => {
      setTaskStatus(title, status);
    },
  });


  const addTask = async(title: string) => {
    let task: Task = await handleAddTask({  title, status: TaskStatus.todo });
fetchTasks();

  };

  const setTaskStatus = (title: string, aistatus: string) => {
    const id = tasks.find((task) => task.title === title)?._id;
    if (!id) {
      return;
    }
    const status = aistatus === "todo" ? TaskStatus.todo : TaskStatus.done;
   handleTaskStatus(id, status).then((res) => {
    fetchTasks();
   }).catch((error) => {
    console.error("Error setting task status:", error);
    setLoading(false);
   })
  };

  const deleteTask =  (title: string) => {
    const id = tasks.find((task) => task.title === title)?._id;
    if (!id) {
      return;
    }
     handleDeleteTask(id).then((res) => {
      fetchTasks();
     }).catch((error) => {
      console.error("Error deleting task:", error);
      setLoading(false);
     })
    
  };
  
  return (
    <TasksContext.Provider value={{ tasks, loading ,addTask, setTaskStatus, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
