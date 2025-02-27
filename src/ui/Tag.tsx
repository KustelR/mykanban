"use client";
import React, { ReactNode, useState } from "react";
import ArrowLeftIcon from "@public/arrow-left.svg";
import ArrowRightIcon from "@public/arrow-right.svg";
import ChangeIcon from "@public/arrow-right.svg";
import DeleteIcon from "@public/delete.svg";
import { removeTag } from "@/scripts/kanban";
import ActionMenu from "./ActionMenu";
import { hexToRgb } from "@/shared/colors";
import { useAppStore } from "@/lib/hooks";
import { EnhancedStore } from "@reduxjs/toolkit";

export default function Tag(props: {
  data: TagData;
  card?: CardData;
  setCard?: (card: CardData) => void;
}) {
  const { data, card, setCard } = props;
  const [isActive, setIsActive] = useState(false);
  const store = useAppStore();
  const parsedColor = hexToRgb(data.color);
  return (
    <div
      onMouseEnter={() => {
        setIsActive(true);
      }}
      onMouseLeave={() => {
        setIsActive(false);
      }}
      style={{
        backgroundColor: `rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, .4)`,
        borderColor: data.color,
      }}
      className={`relative max-w-[200px] rounded-md mr-1 mb-1 px-1 border-[1px]`}
    >
      {isActive &&
        card &&
        setCard &&
        renderActionMenu(data, card, store, setCard)}
      <div className="truncate overflow-hidden text-nowrap text-ellipsis">
        {data.name}
      </div>
    </div>
  );
}

function renderActionMenu(
  tagData: TagData,
  cardData: CardData,
  store: EnhancedStore,
  setCard: (arg: CardData) => void,
) {
  const options = [
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      callback: () => {
        setCard(removeTag(store.getState().kanban, cardData, tagData.id));
      },
    },
  ];

  return <ActionMenu options={options} />;
}
