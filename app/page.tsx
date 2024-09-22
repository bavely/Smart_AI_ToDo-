"use client";

import { TasksList } from "@/components/TasksList";
import { TasksProvider } from "@/lib/hooks/use-tasks";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup, CopilotChat } from "@copilotkit/react-ui";
export default function Home() {
  return (
    <CopilotKit publicApiKey={"ck_pub_016f7ccdce52530140e927e36d29e15b"}>
      <TasksProvider>
        <TasksList />
      </TasksProvider>
      <CopilotPopup />
    </CopilotKit>

  );
}
