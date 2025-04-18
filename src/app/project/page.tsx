import Kanban from "@/components/kanban/Kanban";
import ManualControl from "@/components/kanban/ManualControl";
import { Suspense } from "react";
import ProjectControl from "@/components/ProjectControl";

export default function Project() {
  return (
    <div className="p-3">
      <Suspense>
        <ProjectControl />
      </Suspense>
      <Kanban className="w-full"></Kanban>
    </div>
  );
}
