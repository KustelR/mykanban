"use client";

import { useAppDispatch, useAppStore } from "@/lib/hooks";
import Popup from "@/shared/Popup";
import TextInput from "@/shared/TextInput";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TagEditor from "./TagEditor";
import { setProjectDataAction } from "@/lib/features/kanban/kanbanSlice";
import { requestToApi } from "@/scripts/project";

export default function ProjectEditor() {
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
  return (
    <section
      className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md border-[1px] dark:border-neutral-700 w-fit"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <header className="font-bold">Project Editor</header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name && state) {
            const projectId = store.getState().projectId;
            requestToApi("data/update", { name: name }, "patch", [
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
          cardId=""
          tagIds={state.tags.map((tag) => tag.id)}
          setTagIds={(tagIds) => {
            const tags = state.tags;
            if (!tags) return;
            const filteredTags = tags.filter((tag) => !tagIds.includes(tag.id));
            filteredTags.forEach(() => {
              const projectId = store.getState().projectId;
              requestToApi(
                "tags/delete",
                { id: filteredTags[0].id },
                "delete",
                [{ name: "id", value: projectId }],
              );
              dispatch(
                setProjectDataAction({
                  name: state.name,
                  tags: tags.filter((t) => tagIds.includes(t.id)),
                }),
              );
            });
          }}
        ></TagEditor>
      )}
    </section>
  );
}
export function ProjectEditorPortal(props: {
  projectData?: KanbanState;
  setIsRedacting: (arg: boolean) => void;
}) {
  const { projectData, setIsRedacting } = props;
  return createPortal(
    <Popup setIsActive={setIsRedacting}>
      <ProjectEditor></ProjectEditor>
    </Popup>,
    document.body,
  );
}
