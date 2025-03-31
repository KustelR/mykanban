import { setKanbanAction } from "@/lib/features/kanban/kanbanSlice";
import { setProjectIdAction } from "@/lib/features/projectId/projectIdSlice";
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
    requestToApi("kanban", project, "put");
  });
}

export async function createProject(data: KanbanState) {
  console.log("runs");
  const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!projectHost) return;
  const r = await requestToApi("kanban", data, "post"); //axios.post(`${projectHost}/create`, data);
  addProjectToStorage(r.data);
  redirect(`/project?id=${r.data}`);
}

export async function requestToApi(
  url: string,
  payload: any,
  method: string = "get",
  params?: { name: string; value: string }[],
) {
  const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!projectHost) return Promise.reject("Can't read project host");
  const paramString: string = params
    ? "?" +
      params
        .map((val) => {
          return `${val.name}=${val.value}`;
        })
        .join("&")
    : "";
  return axios.request({
    url: `http://${projectHost}/${url}${paramString}`,
    method: method,
    data: payload,
  });
}

export async function readProject(id: string, dispatch: any) {
  const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
  if (!projectHost) return;
  const r = await requestToApi("kanban", "", "get", [
    { name: "id", value: id },
  ]);
  addProjectToStorage(id, r.data.name);
  dispatch(setKanbanAction(r.data));
  dispatch(setProjectIdAction(id));
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
