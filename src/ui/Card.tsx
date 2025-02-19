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
      {!blocked && (
        <ul
          className={`${isActive ? "" : "hidden"} absolute flex flex-row right-0 top-0 h-fit [font-size:0]`}
        >
          <li>
            <button
              className="h-5 w-5 flex flex-wrap content-center justify-center bg-blue-800 hover:bg-blue-900"
              onClick={() => {
                setColumns(moveCard(columns, cardData.colId, cardData.id, 1));
              }}
            >
              <ArrowUpIcon
                width={16}
                height={16}
                className="*:stroke-white *:fill-transparent"
              ></ArrowUpIcon>
            </button>
          </li>
          <li>
            <button
              className="h-5 w-5 flex flex-wrap content-center justify-center bg-blue-800 hover:bg-blue-900"
              onClick={() => {
                setColumns(moveCard(columns, cardData.colId, cardData.id, -1));
              }}
            >
              <ArrowDownIcon
                width={16}
                height={16}
                className="*:stroke-white *:fill-transparent"
              ></ArrowDownIcon>
            </button>
          </li>
          <li>
            <button
              className="h-5 w-5 flex flex-wrap content-center justify-center bg-green-800 hover:bg-green-900"
              onClick={() => {
                if (!blocked) setIsRedacting(true);
              }}
            >
              <ChangeIcon
                width={16}
                height={16}
                className="*:stroke-white"
              ></ChangeIcon>
            </button>
          </li>
          <li>
            <button
              className="h-5 w-5 flex flex-wrap content-center justify-center bg-red-600/50 hover:bg-red-700/50"
              onClick={(e) => {
                if (cards && setCards) {
                  setColumns(removeCard(cardData.id, cardData.colId, columns));
                }
              }}
            >
              <DeleteIcon
                width={16}
                height={16}
                className=" *:stroke-white"
              ></DeleteIcon>
            </button>
          </li>
        </ul>
      )}
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
