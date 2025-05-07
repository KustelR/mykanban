import Kanban from "@/components/kanban/Kanban";
import { Suspense } from "react";
import ProjectControl from "@/components/ProjectControl";

export default function Project() {
  return (
    <div className="md:p-3">
      <Suspense>
        <ProjectControl />
      </Suspense>
      <div className="h-screen md:h-[800px] lg:h-[1200px]">
        <Kanban />
      </div>
    </div>
  );
}
