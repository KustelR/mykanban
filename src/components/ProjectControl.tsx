"use client";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { createProject, readProject, updateProject } from "@/scripts/project";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function ProjectControl() {
  let params = useSearchParams();
  const store = useAppStore();
  const dispatch = useAppDispatch();
  let id: string | null | undefined;
  useEffect(() => {
    id = params.get("id");
    if (id) {
      readProject(id, dispatch);
    } else {
      createProject(data);
      return;
    }
    updateProject(id, store);
  }, []);
  const data: KanbanState = store.getState().kanban;
  if (id) {
  }
  return <></>;
}
