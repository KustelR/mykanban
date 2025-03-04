"use client";

import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import { nanoid } from "@reduxjs/toolkit";
import React, { useState } from "react";
import TagList from "../TagList";

type TagEditorProps = {
  tags: Array<TagData>;
  cardId?: string;
  addTagIdToCard?: (arg: string) => void;
  setTags: (arg: Array<TagData>) => void;
};

export default function TagEditor(props: TagEditorProps) {
  const { tags, setTags, cardId, addTagIdToCard } = props;
  const [tag, setTag] = useState<TagData | null>(null);
  return (
    <section>
      <header className="font-semibold">Tag Editor</header>
      {tagForm(
        tag,
        (t) => {
          setTags([...tags, t]);
          if (addTagIdToCard) addTagIdToCard(t.id);
        },
        cardId,
      )}
      <strong>Current tags</strong>
      <TagList tags={[...tags, ...(tag ? [tag] : [])]}></TagList>
    </section>
  );
}

function tagForm(
  tag: TagData | null,
  setTag: (arg: TagData) => void,
  cardId?: string,
) {
  const [localTag, setLocalTag] = useState(
    tag ? tag : createTag(undefined, undefined, cardId),
  );
  return (
    <form
      className="block *:block space-y-1"
      onSubmit={(e) => {
        e.preventDefault();
        setTag(localTag);
        setLocalTag(createTag(undefined, undefined, cardId));
        (e.target as HTMLFormElement).reset();
      }}
    >
      <TextInput
        onChange={(e) => {
          setLocalTag({ ...localTag, name: e.target.value });
        }}
        placeholder={tag?.name}
        id="tag_name"
        label="Name"
      />
      <label htmlFor="tag_color">Color</label>
      <input
        onChange={(e) => {
          setLocalTag({ ...localTag, color: e.target.value });
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
    name: name ? name : "fake",
    color: color ? color : "#ff0000",
    cardId: cardId ? cardId : "not a card",
  };
}
