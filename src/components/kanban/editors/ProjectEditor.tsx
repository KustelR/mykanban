"use client";

import { useAppDispatch, useAppStore } from "@/lib/hooks";
import Popup from "@/shared/Popup";
import TextInput from "@/shared/TextInput";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { setProjectDataAction } from "@/lib/features/kanban/kanbanSlice";
import { requestToApi } from "@/scripts/project";
import TextButton from "@/shared/TextButton";
import TagEditor from "./TagEditor";
import { createTag, deleteTag, newTag, removeTag } from "@/scripts/kanban";
import DeleteIcon from "@public/delete.svg";

export default function ProjectEditor(props: { toggleDevMode: () => void }) {
  const { toggleDevMode } = props;
  const [name, setName] = useState<string | null>(null);
  const [state, setState] = useState<KanbanState | null>(null);
  const dispatch = useAppDispatch();
  const store = useAppStore();

  useEffect(() => {
    setState(store.getState().kanban);
    store.subscribe(() => {
      setState(store.getState().kanban);
    });
  }, []);

  const options = [
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      condition: () => {
        return true;
      },
      callback: (tag: TagData) => {
        const kanban = store.getState().kanban;
        const tags = kanban.tags;
        const projectId = kanban.id;
        if (tags) deleteTag(tags, tag.id, dispatch, projectId);
      },
    },
  ];

  return (
    <section
      className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md border-[1px] dark:border-neutral-700 w-fit"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <header className="font-bold">Project Editor</header>
      <ul className="grid grid-cols-2 *:p-2">
        <li className="col-span-1 border-r-[1px] border-neutral-600">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name && state) {
                const projectId = store.getState().kanban.id;
                requestToApi("data", { name: name }, "patch", [
                  { name: "id", value: projectId },
                ]);
                dispatch(
                  setProjectDataAction({
                    name,
                    tags: state.tags ? state.tags : [],
                  }),
                );
              }
            }}
          >
            <TextInput
              onChange={(e) => {
                setName(e.target.value);
              }}
              id="project_editor_name"
              label="name"
            />
          </form>
          {state && state.tags && (
            <TagEditor
              options={options}
              onTagCreation={(name, color) => {
                const kanban = store.getState().kanban;
                const tags = kanban.tags;
                const projectId = kanban.id;
                if (tags)
                  createTag(tags, newTag(name, color), dispatch, projectId);
              }}
            />
          )}
        </li>
        <li className="col-span-1 *:block space-y-2">
          <TextButton onClick={() => toggleDevMode()}>debug data</TextButton>
          <TextButton>open log</TextButton>
        </li>
      </ul>
    </section>
  );
}
export function ProjectEditorPortal(props: {
  projectData?: KanbanState;
  toggleDevMode?: () => void;
  setIsRedacting: (arg: boolean) => void;
}) {
  const { projectData, toggleDevMode, setIsRedacting } = props;
  return createPortal(
    <Popup setIsActive={setIsRedacting}>
      <ProjectEditor
        toggleDevMode={toggleDevMode ? toggleDevMode : () => {}}
      ></ProjectEditor>
    </Popup>,
    document.body,
  );
}
