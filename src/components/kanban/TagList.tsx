import React from "react";
import Tag from "./Tag";

export default function TagList(props: {
  tags: Array<TagData>;
  className?: string;
}) {
  const { tags, className } = props;
  return (
    <ul className={`${className} flex flex-wrap`}>
      {tags.map((tag, idx) => {
        if (idx > 9) return;
        return (
          <li key={tag.id} className="relative w-fit h-fit">
            <Tag data={tag} />
          </li>
        );
      })}
    </ul>
  );
}
