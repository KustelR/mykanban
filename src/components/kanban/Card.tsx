import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CardEditor, { CardEditorPortal } from "./editors/CardEditor";
import ChangeIcon from "@public/change.svg";
import ArrowUpIcon from "@public/arrow-up.svg";
import ArrowDownIcon from "@public/arrow-down.svg";
import DeleteIcon from "@public/delete.svg";
import { useDrag } from "react-dnd";
import { ItemTypes } from "@/Constants";
import { moveCard, removeCard } from "@/scripts/kanban";
import TagList from "./TagList";
import ActionMenu from "../ui/ActionMenu";
import { useAppStore } from "@/lib/hooks";

type CardProps = {
  cardData: CardData;
  blocked?: boolean;
  debug?: boolean;
  cards?: Array<CardData>;
  setCards?: (arg: Array<CardData>) => void;
  setColumns: (arg: Array<ColData>) => void;
  columns: Array<ColData>;
};

export function Card(props: CardProps) {
  const { cardData, blocked, cards, setCards, columns, setColumns, debug } =
    props;
  const { name, description, tagIds } = cardData;
  const [isRedacting, setIsRedacting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [tags, setTags] = useState<Array<TagData>>([]);
  const store = useAppStore();
  useEffect(() => {
    store.subscribe(() => {
      const data = store.getState();
      const locTags = data.kanban.tags;
      const tagIds = data.kanban.columns
        .find((col) => col.id === cardData.columnId)
        ?.cards?.find((c) => c.id === cardData.id)?.tagIds;
      if (!locTags || !tagIds) return;
      setTags(
        locTags.filter((tag) => {
          return tagIds.includes(tag.id);
        }),
      );
    });
  }, []);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: cardData,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      {drag(
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
            <header className="font-bold overflow-hidden line-clamp-3 break-words max-w-[200px]">
              {name}
            </header>
            <p className="text-wrap break-words line-clamp-3">{description}</p>
            <TagList tags={tags} />
            {debug && (
              <div className="bg-red-600/30 rounded-md p-1">
                <strong>debug data</strong>
                <ul>
                  <li>order: {cardData.order}</li>
                </ul>
              </div>
            )}
          </section>
        </div>,
      )}
      {isRedacting &&
        renderEditor(
          cardData,
          blocked,
          isRedacting,
          setIsRedacting,
          cards,
          setCards,
        )}
    </>
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
        setColumns(moveCard(columns, cardData.columnId, cardData.id, -1));
      },
    },
    {
      icon: ArrowDownIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        setColumns(moveCard(columns, cardData.columnId, cardData.id, 1));
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
        setColumns(removeCard(cardData.id, cardData.columnId, columns));
      },
    },
  ];

  return <ActionMenu options={options} />;
}

function renderEditor(
  cardData: CardData,
  blocked: boolean | undefined,
  isRedacting: boolean,
  setIsRedacting: (arg: boolean) => void,
  cards: CardData[] | undefined,
  setCards: ((cards: CardData[]) => void) | undefined,
) {
  return (
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
  );
}
