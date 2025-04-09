import ActionMenu from "@/components/ui/ActionMenu";
import { useAppStore } from "@/lib/hooks";
import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import React, { ReactNode, useEffect, useState } from "react";

interface Frequent {
  frequency: number;
}

type Option = {
  condition: (t: TagData) => boolean;
  callback: (t: TagData) => void;
  icon: (props: {
    width: number;
    height: number;
    className: string;
  }) => ReactNode;
  className: string;
};

/**
 * Accepts actions as in actionMenu that will appear on tag
 */
export default function TagEditorNew(props: {
  options?: Option[];
  onTagCreation?: (name: string, color: string) => void;
}) {
  const { options, onTagCreation } = props;
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState("");
  const [tags, setTags] = useState<(TagData & Frequent)[]>([]);
  const store: AppStore = useAppStore();

  useEffect(() => {
    updateTags(store.getState().kanban, setTags);
    store.subscribe(() => {
      updateTags(store.getState().kanban, setTags);
    });
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
      {isActive && (
        <Suggestions
          filterString={input}
          tags={tags}
          onTagCreation={(color) => {
            onTagCreation ? onTagCreation(input, color) : () => {};
          }}
          options={options ? options : []}
        />
      )}
    </div>
  );
}

function Suggestions(props: {
  tags: (TagData & Frequent)[];
  filterString: string;
  options: Array<Option>;
  onTagCreation: (color: string) => void;
}) {
  const [color, setColor] = useState("#000000");
  const { tags, filterString, options, onTagCreation } = props;
  const filteredTags = tags.filter((t) => t.name.startsWith(filterString));
  if (filterString === "") return;
  return (
    <div className="bg-transparent pt-2 absolute min-w-64">
      <ol className="bg-neutral-200 border-neutral-400 dark:bg-neutral-800 space-y-0.5 py-1 rounded-md dark:border-neutral-700 border-[1px]">
        {filteredTags.length === 0 && (
          <li className=" px-3">
            <form
              className="*:block"
              action=""
              onSubmit={(e) => {
                e.preventDefault();
                onTagCreation(color);
              }}
            >
              <header className="font-semibold">
                "{filterString}" not found... Create it?
              </header>
              <div className="*:block">
                <label className=" m-auto" htmlFor="new-tag-color">
                  color
                </label>
                <input
                  style={{ width: 60, height: 40 }}
                  id="new-tag-color"
                  type="color"
                  onChange={(e) => {
                    setColor(e.target.value);
                  }}
                />
              </div>
              <TextButton className="w-full">add new</TextButton>
            </form>
          </li>
        )}
        {filteredTags.length > 0 &&
          filteredTags.map((t, idx) => {
            if (idx > 10) return;
            return <TagSuggestion key={t.id} tag={t} options={options} />;
          })}
      </ol>
    </div>
  );
}

function renderActionMenu(options: Option[], tagData: TagData) {
  return (
    <ActionMenu
      options={options
        .filter((o) => o.condition(tagData))
        .map((o) => {
          return {
            ...o,
            callback: () => {
              o.callback(tagData);
            },
          };
        })}
    />
  );
}

function TagSuggestion(props: { tag: TagData & Frequent; options: Option[] }) {
  const { tag, options } = props;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <li
      className=" flex space-x-2 px-3 hover:bg-neutral-300 dark:hover:bg-neutral-900 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && renderActionMenu(options, tag)}
      <span
        className=" text-white h-full px-2 rounded-sm"
        style={{ backgroundColor: tag.color }}
      >
        {tag.name}
      </span>
      <span>marked {tag.frequency} cards</span>
    </li>
  );
}

function updateTags(
  state: KanbanState,
  setTags: (tags: (TagData & Frequent)[]) => void,
) {
  const rawTags: (TagData & Frequent)[] = [];
  const cards: CardData[] = [];
  state.columns.forEach((col) => {
    if (col.cards) cards.push(...col.cards);
  });
  state.tags?.forEach((t) => {
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
}
