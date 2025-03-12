import React, { useEffect, useState } from "react";
import Tag from "./Tag";
import { useAppStore } from "@/lib/hooks";
import { EnhancedStore } from "@reduxjs/toolkit";

export default function TagList(props: {
  tagIds: string[];
  className?: string;
}) {
  const { tagIds, className } = props;
  const [tags, setTags] = useState<TagData[]>([]);
  const store = useAppStore();
  useEffect(() => {
    loadTags(setTags, store);
    store.subscribe(() => {
      loadTags(setTags, store);
    });
  }, []);
  return (
    <ul className={`${className} flex flex-wrap`}>
      {tagIds.map((id, idx) => {
        if (idx > 9) return;
        const tag = tags.find((t) => t.id === id);
        if (!tag) return;
        return (
          <li key={id} className="relative w-fit mr-1 mb-1 h-fit">
            <Tag data={tag} />
          </li>
        );
      })}
    </ul>
  );
}

function loadTags(
  setTags: (arg: TagData[]) => void,
  store: EnhancedStore<{ kanban: KanbanState }>,
) {
  const storeTags = store.getState().kanban.tags;
  if (!storeTags) return;
  setTags(storeTags);
}
