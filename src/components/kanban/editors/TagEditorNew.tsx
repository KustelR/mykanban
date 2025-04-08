import { useAppStore } from "@/lib/hooks";
import TextInput from "@/shared/TextInput";
import React, { useEffect, useState } from "react";

interface Frequent {
  frequency: number;
}

export default function TagEditorNew() {
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<(TagData & Frequent)[]>([]);
  const store: AppStore = useAppStore();

  useEffect(() => {
    const state = store.getState();
    const rawTags: (TagData & Frequent)[] = [];
    const cards: CardData[] = [];
    state.kanban.columns.forEach((col) => {
      if (col.cards) cards.push(...col.cards);
    });
    state.kanban.tags?.forEach((t) => {
      let frequency = 0;
      cards.forEach((c) => {
        if (c.tagIds.includes(t.id)) frequency++;
      });
      rawTags.push({
        ...t,
        frequency: frequency,
      });
    });
    setTags(rawTags);
  }, []);

  return (
    <div>
      <TextInput
        onChange={(e) => {
          setInput(e.target.value);
          setIsActive(true);
        }}
        id="tag_editor_input"
        label="enter tag name..."
      />
      {isActive && <Suggestions filterString={input} tags={tags} />}
    </div>
  );
}

function Suggestions(props: {
  tags: (TagData & Frequent)[];
  filterString: string;
}) {
  const { tags, filterString } = props;
  const filteredTags = tags.filter((t) => t.name.startsWith(filterString));
  if (filterString === "") return;
  if (filteredTags.length + tags.length === 0) return;
  return (
    <div className="bg-transparent pt-2 absolute min-w-64">
      <ol className="dark:bg-neutral-800 space-y-0.5 py-1 rounded-md dark:border-neutral-700 border-[1px]">
        {filteredTags.length === 0 && (
          <li className=" px-3 dark:hover:bg-neutral-900">create new...</li>
        )}
        {filteredTags.length > 0 &&
          filteredTags.map((t, idx) => {
            if (idx > 10) return;
            return (
              <li
                className="flex space-x-2 px-3 dark:hover:bg-neutral-900"
                key={t.id}
              >
                <span
                  className="h-full px-2 rounded-sm"
                  style={{ backgroundColor: t.color }}
                >
                  {t.name}
                </span>
                <span>marked {t.frequency} cards</span>
              </li>
            );
          })}
      </ol>
    </div>
  );
}
