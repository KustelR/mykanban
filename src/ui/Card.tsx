import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CardEditor, { CardEditorPortal } from "./CardEditor";
import ChangeIcon from "@public/change.svg";
import ArrowUpIcon from "@public/arrow-up.svg";
import ArrowDownIcon from "@public/arrow-down.svg";
import DeleteIcon from "@public/delete.svg";
import { useDrag } from "react-dnd";
import { ItemTypes } from "@/Constants";
import { moveCard, removeCard } from "@/scripts/kanban";
import Tag from "@/ui/Tag";
import TagList from "./TagList";
import ActionMenu from "./ActionMenu";

type CardProps = {
  cardData: CardData;
  blocked?: boolean;
  cards?: Array<CardData>;
  setCards?: (arg: Array<CardData>) => void;
  setColumns: (arg: Array<ColData>) => void;
  columns: Array<ColData>;
};

export function Card(props: CardProps) {
  const { cardData, blocked, cards, setCards, columns, setColumns } = props;
  const { title, description, tags } = cardData;
  const [isRedacting, setIsRedacting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: cardData,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return drag(
    <div
      className={`${isDragging ? "cursor-move" : "cursor-pointer"} size-fit relative w-full`}
      onMouseEnter={(e) => {
        setIsActive(true);
      }}
      onMouseLeave={(e) => {
        setIsActive(false);
      }}
    >
      {!blocked &&
        isActive &&
        renderActionMenu(columns, cardData, setColumns, setIsRedacting)}
      <section className="rounded-md hover:bg-neutral-300 border-[1px] dark:border-neutral-700 hover:dark:bg-neutral-800 p-2 ">
        <header className="font-bold">{title}</header>
        <p className="text-wrap break-words line-clamp-3">{description}</p>
        <TagList tags={tags} />
      </section>
      {isRedacting && (
        <CardEditorPortal
          cardData={cardData}
          setCardData={(card) => {
            if (cards && setCards) {
              const cardIdx = cards.findIndex((card2) => {
                return card2.id === card.id;
              });
              const newCards = [...cards];
              newCards[cardIdx] = card;
              setCards(newCards);
            } else {
              throw new Error("trying to change unknown card");
            }
          }}
          blocked={blocked}
          isRedacting={isRedacting}
          setIsRedacting={setIsRedacting}
        />
      )}
    </div>,
  );
}

function renderActionMenu(
  columns: Array<ColData>,
  cardData: CardData,
  setColumns: (arg: Array<ColData>) => void,
  setIsEditing: (arg: boolean) => void,
) {
  const options = [
    {
      icon: ArrowUpIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        setColumns(moveCard(columns, cardData.colId, cardData.id, 1));
      },
    },
    {
      icon: ArrowDownIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        setColumns(moveCard(columns, cardData.colId, cardData.id, -1));
      },
    },
    {
      icon: ChangeIcon,
      className: "bg-green-800 hover:bg-green-900",
      callback: () => {
        setIsEditing(true);
      },
    },
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      callback: () => {
        setColumns(removeCard(cardData.id, cardData.colId, columns));
      },
    },
  ];

  return <ActionMenu options={options} />;
}
