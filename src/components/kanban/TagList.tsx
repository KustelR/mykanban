import React from "react";
import Tag from "./Tag";
import { useAppStore } from "@/lib/hooks";

export default function TagList(props: {
  tags: Array<TagData>;

  className?: string;
}) {
  const { tags, className } = props;

  return (
    <ul className={`${className} flex flex-wrap`}>
      {tags.map((tag, idx) => {
        if (!tag) return;
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
