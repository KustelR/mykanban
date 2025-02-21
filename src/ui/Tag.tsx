"use client";
import React, { ReactNode, useState } from "react";
import ArrowLeftIcon from "@public/arrow-left.svg";
import ArrowRightIcon from "@public/arrow-right.svg";
import ChangeIcon from "@public/arrow-right.svg";
import DeleteIcon from "@public/delete.svg";
import { removeTag, swapTags } from "@/scripts/kanban";
import ActionMenu from "./ActionMenu";

export default function Tag(props: {
  data: TagData;
  card?: CardData;
  setCard?: (card: CardData) => void;
}) {
  const { data, card, setCard } = props;
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setIsActive(true);
      }}
      onMouseLeave={() => {
        setIsActive(false);
      }}
      style={{
        backgroundColor: `rgba(${data.color.r} ${data.color.g} ${data.color.b} / 40%)`,
        borderColor: `rgb(${data.color.r + 40} ${data.color.g + 40} ${data.color.b + 40})`,
      }}
      className="relative max-w-[200px] rounded-md mr-1 mb-1 px-1 border-[1px]"
    >
      {isActive && card && setCard && renderActionMenu(data, card, setCard)}
      <div className="truncate overflow-hidden text-nowrap text-ellipsis">
        {data.name}
      </div>
    </div>
  );
}

function renderActionMenu(
  tagData: TagData,
  cardData: CardData,
  setCard: (arg: CardData) => void,
) {
  const options = [
    {
      icon: ArrowLeftIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const tag2Idx =
          cardData.tags.findIndex((tag) => tag.id === tagData.id) - 1;
        if (tag2Idx === -1) return;
        setCard(swapTags(cardData, tagData.id, cardData.tags[tag2Idx].id));
      },
    },
    {
      icon: ArrowRightIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const tag2Idx =
          cardData.tags.findIndex((tag) => tag.id === tagData.id) + 1;
        if (tag2Idx >= cardData.tags.length || tag2Idx === -1) return;
        setCard(swapTags(cardData, tagData.id, cardData.tags[tag2Idx].id));
      },
    },
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      callback: () => {
        setCard(removeTag(cardData, tagData.id));
      },
    },
  ];

  return <ActionMenu options={options} />;
}
