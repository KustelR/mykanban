"use client";

import { requestToApi } from "@/scripts/project";
import TextButton from "@/shared/TextButton";
import { redirect } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ProjectList() {
  const [projectStorage, setProjectStorage] = useState<ProjectStamp[]>([]);
  useEffect(() => {
    const projectsStorageJson = localStorage.getItem("projects");
    setProjectStorage(
      projectsStorageJson ? JSON.parse(projectsStorageJson) : [],
    );
  }, []);

  return (
    <div className="border-neutral-300 dark:border-neutral-700 border-[1px] p-2 rounded-md w-fit space-y-2">
      <strong>Last opened projects:</strong>
      <ul className="space-y-1">
        {projectStorage
          .sort((p1, p2) => {
            return p2.lastOpened - p1.lastOpened;
          })
          .map((p, idx) => {
            return (
              <li key={idx} className="dark:hover:bg-neutral-800 px-2">
                <Link className="block w-full" href={`project/?id=${p.id}`}>
                  {p.name ? p.name : p.id} : {formatDate(p.lastOpened)}
                </Link>
              </li>
            );
          })}
      </ul>
      <TextButton
        onClick={async () => {
          const res = await requestToApi(
            "kanban",
            { name: "new project" },
            "post",
          );
          if (typeof res.data === "string") {
            redirect(`/project/?id=${res.data}`);
          }
        }}
      >
        Create new
      </TextButton>
    </div>
  );
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const locale = navigator.language;
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
