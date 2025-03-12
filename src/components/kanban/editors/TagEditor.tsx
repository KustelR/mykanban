"use client";

import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import { EnhancedStore, nanoid } from "@reduxjs/toolkit";
import React, { useState } from "react";
import TagList from "../TagList";
import Tag from "../Tag";
import DeleteIcon from "@public/delete.svg";
import PlusIcon from "@public/plus.svg";
import ActionMenu from "@/components/ui/ActionMenu";
import { updateCardTags, updateTags } from "@/lib/features/kanban/kanbanSlice";
import { useAppDispatch, useAppStore } from "@/lib/hooks";

type TagEditorProps = {
  tags: Array<TagData>;
  cardId: string;
  tagIds: string[];
};

export default function TagEditor(props: TagEditorProps) {
  const { tags, cardId, tagIds } = props;
  const [tag, setTag] = useState<TagData>(createTag());
  return (
    <section>
      <header className="font-semibold">Tag Editor</header>
      {tagForm(tag, setTag)}
      {renderTagSuggestions(cardId, tags, tag, tagIds)}
    </section>
  );
}

function tagForm(tag: TagData, setTag: (arg: TagData) => void) {
  return (
    <form
      className="block *:block space-y-1"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <TextInput
        onChange={(e) => {
          setTag({ ...tag, name: e.target.value });
        }}
        placeholder={tag?.name}
        id="tag_name"
        label="tag name"
      />
      <label htmlFor="tag_color">Color</label>
      <input
        onChange={(e) => {
          setTag({ ...tag, color: e.target.value });
        }}
        id="tag_color"
        type="color"
      />
    </form>
  );
}

function createTag(name?: string, color?: string, cardId?: string): TagData {
  return {
    id: nanoid(),
    name: name ? name : "",
    color: color ? color : "#ff0000",
    cardId: cardId ? cardId : "not a card",
  };
}

function renderTagSuggestions(
  cardId: string,
  tags: TagData[],
  tag: TagData,
  tagIds: string[],
) {
  return (
    <section>
      {" "}
      <strong>Suggested tags</strong>
      <ul className="space-y-1">
        {[...tags, ...(tag ? [tag] : [])]
          .filter((t) => t.name.startsWith(tag?.name ? tag.name : ""))
          .slice(0, 5)
          .map((item, idx) => {
            return (
              <li key={idx}>
                <SuggestedTag cardId={cardId} data={item} tagIds={tagIds} />
              </li>
            );
          })}
      </ul>
    </section>
  );
}

function SuggestedTag(props: {
  data: TagData;
  cardId: string;
  tagIds: string[];
}) {
  const { data, cardId, tagIds } = props;
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const store = useAppStore();
  return (
    <div
      className="relative w-full h-fit"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <Tag data={data}></Tag>
      {isHovered && renderActionMenu(data, store, cardId, dispatch, tagIds)}
    </div>
  );
}

function renderActionMenu(
  tag: TagData,
  store: AppStore,
  cardId: string,
  dispatch: AppDispatch,
  tagIds: string[],
) {
  const options = [
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      callback: () => {
        updateCardTags(
          dispatch,
          store,
          cardId,
          tagIds.filter((t) => t != tag.id),
        );
      },
    },
    {
      icon: PlusIcon,
      className: "bg-green-800 hover:bg-green-900",
      callback: () => {
        const storeTags = store
          .getState()
          .kanban.tags?.filter((t) => t.id === tag.id);
        if (!storeTags) throw new Error("Can't read tags");
        if (storeTags.filter((t) => t.id === tag.id).length === 0) {
          updateTags(dispatch, store, storeTags.concat(tag));
        }
        updateCardTags(dispatch, store, cardId, tagIds.concat(tag.id));
      },
    },
  ];

  return <ActionMenu options={options} />;
}
