import React from "react";
import Tag from "./Tag";
import { useAppStore } from "@/lib/hooks";

export default function TagList(props: {
  tags: Array<TagData>;
  card?: CardData;
  setCard?: (card: CardData) => void;
  className?: string;
  editable?: boolean;
}) {
  const { tags, className, card, setCard } = props;
  return (
    <ul className={`${className} flex flex-wrap`}>
      {tags.map((tag, idx) => {
        if (!tag) return;
        if (idx > 9) return;
        return (
          <li key={tag.id} className="relative w-fit h-fit">
            <Tag data={tag} card={card} setCard={setCard} />
          </li>
        );
      })}
    </ul>
  );
}
