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
    loadTags(tagIds, setTags, store);
    store.subscribe(() => {
      loadTags(tagIds, setTags, store);
    });
  }, []);
  return (
    <ul className={`${className} flex flex-wrap`}>
      {tags.map((tag, idx) => {
        if (idx > 9) return;
        return (
          <li key={tag.id} className="relative w-fit mr-1 mb-1 h-fit">
            <Tag data={tag} />
          </li>
        );
      })}
    </ul>
  );
}

function loadTags(
  tagIds: string[],
  setTags: (arg: TagData[]) => void,
  store: EnhancedStore<{ kanban: KanbanState }>,
) {
  const storeTags = store.getState().kanban.tags;
  if (!storeTags) return;
  setTags(storeTags.filter((t) => tagIds.includes(t.id)));
}
