import Kanban from "@/components/kanban/Kanban";
import { Suspense } from "react";
import ProjectControl from "@/components/ProjectControl";

export default function Project() {
  return (
    <div className="md:p-3 flex-1">
      <Suspense>
        <ProjectControl />
      </Suspense>
      <div className="h-5/6">
        <Kanban />
      </div>
    </div>
  );
}
