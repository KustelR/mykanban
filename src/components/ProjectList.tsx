"use client";

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
    <div className="border-neutral-300 dark:border-neutral-700 border-[1px] p-2 rounded-md w-fit">
      <strong>Last opened projects:</strong>
      <ul className="space-y-1">
        {projectStorage
          .sort((p1, p2) => {
            return p2.lastOpened - p1.lastOpened;
          })
          .map((p, idx) => {
            return (
              <li key={idx} className="hover:dark:bg-neutral-800 px-2">
                <Link className="block w-full" href={`project/?id=${p.id}`}>
                  {p.name ? p.name : p.id} :{" "}
                  {new Date(p.lastOpened).toUTCString()}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
