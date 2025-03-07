import { updateKanban } from "@/lib/features/kanban/kanbanSlice";
import { EnhancedStore } from "@reduxjs/toolkit";
import axios from "axios";
import { redirect } from "next/navigation";

export function updateProject(id: string, store: EnhancedStore) {
  let lastHash: string = "";
  store.subscribe(() => {
    const lastChanged: LastChangedState = store.getState().lastChanged;
    if (lastHash == lastChanged.hash && lastChanged.hash != "") {
      return;
    }
    lastHash = lastChanged.hash;
    const project: KanbanState = store.getState().kanban;
    if (project.name == "fake name fake name") return;
    const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
    if (!projectHost)
      throw new Error("Can't get projectAPI host, can't update");
    axios.put(`${projectHost}/update?id=${id}`, project);
  });
}

export async function createProject(data: KanbanState) {
  const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!projectHost) return;
  const r = await axios.post(`${projectHost}/create`, data);
  addProjectToStorage(r.data);
  redirect(`/project?id=${r.data}`);
}

export async function readProject(id: string, dispatch: any) {
  const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!projectHost) return;
  const r = await axios.get(`${projectHost}/read?id=${id}`);
  addProjectToStorage(id, r.data.name);
  updateKanban(dispatch, r.data);
}

export function addProjectToStorage(projectId: string, name?: string) {
  const projectsStorageJson = localStorage.getItem("projects");
  if (!projectsStorageJson) {
    localStorage.setItem("projects", JSON.stringify([projectId]));
    return;
  }
  const projectStorage: Array<ProjectStamp> = JSON.parse(projectsStorageJson);
  if (
    projectStorage.filter((p) => {
      return p.id === projectId;
    }).length > 0
  ) {
    const prEntry = projectStorage.find((p) => p.id === projectId);
    if (prEntry) {
      prEntry.lastOpened = Date.now();
      prEntry.name = name;
      localStorage.setItem("projects", JSON.stringify(projectStorage));
    }
    return;
  }
  projectStorage.push({ id: projectId, lastOpened: Date.now() });
  localStorage.setItem("projects", JSON.stringify(projectStorage));
}
