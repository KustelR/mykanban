"use client";

import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import { EnhancedStore, nanoid } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import TagList from "../TagList";
import Tag from "../Tag";
import DeleteIcon from "@public/delete.svg";
import PlusIcon from "@public/plus.svg";
import ActionMenu from "@/components/ui/ActionMenu";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { setTagsAction } from "@/lib/features/kanban/kanbanSlice";
import { requestToApi } from "@/scripts/project";

type TagEditorProps = {
  cardId: string;
  tagIds: string[];
  setTagIds: (arg: string[]) => void;
};

export default function TagEditor(props: TagEditorProps) {
  const { cardId, tagIds, setTagIds } = props;
  const [tag, setTag] = useState<TagData>(newTag());
  const [tags, setTags] = useState<TagData[]>([]);

  const store = useAppStore();

  useEffect(() => {
    let projectTags = store.getState().kanban.tags;
    if (projectTags) setTags(projectTags);
    store.subscribe(() => {
      projectTags = store.getState().kanban.tags;
      if (projectTags) setTags(projectTags);
    });
  }, []);

  return (
    <section>
      <header className="font-semibold">Tag Editor</header>
      {tagForm(tag, setTag, tags, tagIds, setTagIds)}
      {renderTagSuggestions(cardId, tags, tag, tagIds, setTagIds)}
    </section>
  );
}

function tagForm(
  tag: TagData,
  setTag: (arg: TagData) => void,
  tags: TagData[],
  tagIds: string[],
  setTagIds: (arg: string[]) => void,
) {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  return (
    <form
      className="block *:block space-y-1"
      onSubmit={(e) => {
        e.preventDefault();
        const projectId = store.getState().projectId;
        createTag(tags, tag, tagIds, setTagIds, dispatch, projectId);
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

function newTag(name?: string, color?: string, cardId?: string): TagData {
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
  setTagIds: (arg: string[]) => void,
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
                  cardId={cardId}
                  data={item}
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

function SuggestedTag(props: {
  data: TagData;
  cardId: string;
  tagIds: string[];
  setTagIds: (arg: string[]) => void;
}) {
  const { data, cardId, tagIds, setTagIds } = props;
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
      {isHovered &&
        renderActionMenu(data, store, cardId, dispatch, tagIds, setTagIds)}
    </div>
  );
}

function renderActionMenu(
  tag: TagData,
  store: AppStore,
  cardId: string,
  dispatch: AppDispatch,
  tagIds: string[],
  setTagIds: (arg: string[]) => void,
) {
  const options = [
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      callback: () => {
        const data = tagIds.filter((t) => t !== tag.id);
        console.log(data);
        setTagIds([...data]);
      },
    },
    {
      icon: PlusIcon,
      className: "bg-green-800 hover:bg-green-900",
      callback: () => {
        const projectId = store.getState().projectId;

        let storeTags = store.getState().kanban.tags;
        if (!storeTags) storeTags = [];
        createTag(storeTags, tag, tagIds, setTagIds, dispatch, projectId);
      },
    },
  ];
  if (tagIds.includes(tag.id)) {
    return <ActionMenu options={[options[0]]} />;
  } else {
    return <ActionMenu options={[options[1]]} />;
  }
}

function createTag(
  tags: TagData[],
  tag: TagData,
  tagIds: string[],
  setTagIds: (arg: string[]) => void,
  dispatch: AppDispatch,
  projectId: string,
) {
  if (tags.filter((t) => t.id === tag.id).length === 0) {
    dispatch(setTagsAction(tags.concat(tag)));
    requestToApi("tags/create", tag, "post", [
      { name: "id", value: projectId },
    ]);
  }
  setTagIds(tagIds.concat(tag.id));
}
