"use client";

import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import { nanoid } from "@reduxjs/toolkit";
import React, { useState } from "react";
import TagList from "../TagList";
import Tag from "../Tag";
import DeleteIcon from "@public/delete.svg";
import PlusIcon from "@public/plus.svg";
import ActionMenu from "@/components/ui/ActionMenu";

type TagEditorProps = {
  tags: Array<TagData>;
  cardId?: string;
  tagIds: string[];
  setTagIds: (arg: string[]) => void;
  setTags: (arg: Array<TagData>) => void;
};

export default function TagEditor(props: TagEditorProps) {
  const { tags, setTags, cardId, tagIds, setTagIds } = props;
  const [tag, setTag] = useState<TagData>(createTag());
  return (
    <section>
      <header className="font-semibold">Tag Editor</header>
      {tagForm(tag, setTag)}
      {renderTagSuggestions(tags, tag, setTags, tagIds, setTagIds)}
    </section>
  );
}

function tagForm(tag: TagData, setTag: (arg: TagData) => void) {
  return (
    <form
      className="block *:block space-y-1"
      onSubmit={(e) => {
        e.preventDefault();
        (e.target as HTMLFormElement).reset();
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

function SuggestedTag(props: {
  data: TagData;
  tags: TagData[];
  setTags: (tags: TagData[]) => void;
  tagIds: string[];
  setTagIds: (ids: string[]) => void;
}) {
  const { data, tags, setTags, tagIds, setTagIds } = props;
  const [isHovered, setIsHovered] = useState(false);
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
      {isHovered && renderActionMenu(data, tags, setTags, tagIds, setTagIds)}
    </div>
  );
}

function renderTagSuggestions(
  tags: TagData[],
  tag: TagData,
  setTags: (tags: TagData[]) => void,
  tagIds: string[],
  setTagIds: (ids: string[]) => void,
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
                <SuggestedTag
                  data={item}
                  tags={tags}
                  setTags={setTags}
                  tagIds={tagIds}
                  setTagIds={setTagIds}
                />
              </li>
            );
          })}
      </ul>
    </section>
  );
}

function renderActionMenu(
  tag: TagData,
  tags: Array<TagData>,
  setTags: (arg: Array<TagData>) => void,
  tagIds: string[],
  setTagIds: (ids: string[]) => void,
) {
  const options = [
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      callback: () => {
        setTagIds(tagIds.filter((t) => t != tag.id));
      },
    },
    {
      icon: PlusIcon,
      className: "bg-green-800 hover:bg-green-900",
      callback: () => {
        if (tags.filter((t) => t.id == tag.id).length == 0) {
          setTags(tags.concat(tag));
        }
        setTagIds(tagIds.concat(tag.id));
      },
    },
  ];

  return <ActionMenu options={options} />;
}
