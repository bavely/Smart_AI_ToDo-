"use client";

import { TasksList } from "@/components/TasksList";
import { TasksProvider } from "@/lib/hooks/use-tasks";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup, CopilotChat } from "@copilotkit/react-ui";
export default function Home() {
  return (
    <CopilotKit publicApiKey={process.env.CP_KEY}>
      <TasksProvider>
        <TasksList />
      </TasksProvider>
      <CopilotPopup />
    </CopilotKit>

  );
}
