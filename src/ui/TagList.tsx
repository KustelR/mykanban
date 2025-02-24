import React from "react";
import Tag from "./Tag";
import { useAppStore } from "@/lib/hooks";

export default function TagList(props: {
  tagIds: Array<string>;
  card?: CardData;
  setCard?: (card: CardData) => void;
  className?: string;
  editable?: boolean;
}) {
  const store = useAppStore();
  const { tagIds, className, card, setCard } = props;
  return (
    <ul className={`${className} flex flex-wrap`}>
      {tagIds.map((tagId, idx) => {
        const tag = store.getState().kanban.tags.find((t) => t.id === tagId);
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
