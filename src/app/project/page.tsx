"use client";

import { setKanbanAction } from "@/lib/features/kanban/kanbanSlice";
import { updateLastChanged } from "@/lib/features/lastChanged/lastChangedSlice";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import Kanban from "@/ui/Kanban";
import ManualControl from "@/ui/ManualControl";
import axios from "axios";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Project() {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  useEffect(() => {
    const upload = setInterval(() => {
      const lastChanged = store.getState().lastChanged;
      if (Date.now() - lastChanged < 10000) return;
      const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
      if (!projectHost) return;
      const data: KanbanState = store.getState().kanban;
      let id = searchParams.get("id");
      axios.put(`${projectHost}/update?id=${id}`, data);
      dispatch(updateLastChanged());
    }, 10000);
    return () => {
      clearInterval(upload);
    };
  }, []);
  const data: KanbanState = store.getState().kanban;
  let id = searchParams.get("id");
  if (!id) {
    getId(data);
  } else {
    loadState(id, dispatch);
  }
  return (
    <div className="">
      <Kanban defaultLabel="TEST" className="w-full md:max-w-fit"></Kanban>
      <ManualControl></ManualControl>
    </div>
  );
}

async function getId(data: KanbanState) {
  const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!projectHost) return;
  const r = await axios.post(`${projectHost}/create`, data);
  redirect(`/project?id=${r.data}`);
}

async function loadState(id: string, dispatch: any) {
  const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!projectHost) return;
  const r = await axios.get(`${projectHost}/read?id=${id}`);
  dispatch(setKanbanAction(r.data));
}
