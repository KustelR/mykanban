"use client";

import { updateKanbanMeta } from "@/lib/features/kanban/kanbanSlice";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import Popup from "@/shared/Popup";
import TextInput from "@/shared/TextInput";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TagEditor from "./TagEditor";

export default function ProjectEditor() {
  const [name, setName] = useState<string | null>(null);
  const [tags, setTags] = useState<TagData[] | null>(null);
  const dispatch = useAppDispatch();
  const store = useAppStore();

  useEffect(() => {
    const stateStamp = store.getState().kanban;
    setName(stateStamp.name);
    setTags(stateStamp.tags ? stateStamp.tags : []);
  }, []);
  useEffect(() => {
    if (name && tags) updateKanbanMeta(dispatch, store, { name, tags });
  }, [tags]);
  return (
    <div className="w-full h-full place-content-center place-items-center">
      <section
        className="p-2 dark:bg-neutral-800 rounded-md border-[1px] dark:border-neutral-700 w-fit"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <header className="font-bold">Project Editor</header>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name && tags) updateKanbanMeta(dispatch, store, { name, tags });
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
        {tags && (
          <TagEditor
            tags={tags}
            setTags={setTags}
            tagIds={tags.map((tag) => tag.id)}
            setTagIds={(tagIds) => {
              setTags(tags.filter((tag) => tagIds.includes(tag.id)));
            }}
          ></TagEditor>
        )}
      </section>
    </div>
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
