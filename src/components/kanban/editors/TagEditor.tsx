"use client";

import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import { nanoid } from "@reduxjs/toolkit";
import React, { useState } from "react";
import TagList from "../TagList";
import Tag from "../Tag";
import DeleteIcon from "@public/delete.svg";
import ActionMenu from "@/components/ui/ActionMenu";

type TagEditorProps = {
  tags: Array<TagData>;
  cardId?: string;
  addTagIdToCard?: (arg: string) => void;
  setTags: (arg: Array<TagData>) => void;
};

export default function TagEditor(props: TagEditorProps) {
  const { tags, setTags, cardId, addTagIdToCard } = props;
  const [tag, setTag] = useState<TagData>(createTag());
  return (
    <section>
      <header className="font-semibold">Tag Editor</header>
      {tagForm(tag, setTag)}
      {renderTagSuggestions(tags, tag)}
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
        label="Name"
      />
      <label htmlFor="tag_color">Color</label>
      <input
        onChange={(e) => {
          setTag({ ...tag, color: e.target.value });
        }}
        id="tag_color"
        type="color"
      />
      <TextButton>ADD TAG</TextButton>
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

function SuggestedTag(props: { data: TagData; tags: TagData[] }) {
  const { data, tags } = props;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {isHovered && renderActionMenu(data, tags, () => {})}
      <Tag data={data}></Tag>
    </div>
  );
}

function renderTagSuggestions(tags: TagData[], tag: TagData | null) {
  return (
    <section>
      {" "}
      <strong>Suggested tags</strong>
      <ul>
        {[...tags, ...(tag ? [tag] : [])]
          .filter((t) => t.name.startsWith(tag?.name ? tag.name : ""))
          .slice(0, 5)
          .map((item, idx) => {
            return (
              <li key={idx}>
                <SuggestedTag data={item} tags={tags} />
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
) {
  const options = [
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      callback: () => {
        setTags(
          tags.filter((t) => {
            t.id != tag.id;
          }),
        );
      },
    },
  ];

  return <ActionMenu options={options} />;
}
