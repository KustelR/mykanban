import Kanban from "@/components/kanban/Kanban";
import ManualControl from "@/components/kanban/ManualControl";
import { Suspense } from "react";
import ProjectControl from "@/components/ProjectControl";

export default function Project() {
  return (
    <div>
      <Suspense>
        <ProjectControl />
      </Suspense>
      <Kanban debug className="w-full md:max-w-fit"></Kanban>
    </div>
  );
}
