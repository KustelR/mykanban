import React, { ReactNode, useState } from "react";
import ChangeIcon from "@public/change.svg";
import ArrowUpIcon from "@public/arrow-up.svg";
import ArrowDownIcon from "@public/arrow-down.svg";
import DeleteIcon from "@public/delete.svg";
import { moveCard, removeCard } from "@/scripts/kanban";
import ActionMenu from "../ui/ActionMenu";
import { CardEditorPortal } from "./editors/CardEditor";
import { useDrag } from "react-dnd";
import { ItemTypes } from "@/Constants";
import { updateColumnCards } from "@/lib/features/kanban/kanbanSlice";
import { getCard, getColumn } from "@/lib/features/kanban/utils";
import { useAppDispatch, useAppStore } from "@/lib/hooks";

type CardActionsProps = {
  children?: ReactNode;
  blocked?: boolean;
  cardData: CardData;
  cards?: Array<CardData>;
  setCards?: (arg: Array<CardData>) => void;
};

export default function CardActions(props: CardActionsProps) {
  const { children, blocked, cardData, cards, setCards } = props;

  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const store = useAppStore();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: cardData,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div>
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
          {children}
          {!blocked &&
            isActive &&
            renderActionMenu(cardData, setIsEditing, dispatch, store)}
        </div>,
      )}
      {isEditing && (
        <Editor
          blocked={blocked}
          cardData={cardData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
}

function renderActionMenu(
  cardData: CardData,
  setIsEditing: (arg: boolean) => void,
  dispatch: AppDispatch,
  store: AppStore,
) {
  const options = [
    {
      icon: ArrowUpIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const { column } = getColumn(
          store.getState().kanban,
          cardData.columnId,
        );
        const cards = column.cards;
        if (!cards) throw new Error("Column doesn't have any cards");
        updateColumnCards(
          dispatch,
          store,
          cardData.columnId,
          moveCard(cards, cardData.id, -1),
        );
      },
    },
    {
      icon: ArrowDownIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const { column } = getColumn(
          store.getState().kanban,
          cardData.columnId,
        );
        const cards = column.cards;
        if (!cards) throw new Error("Column doesn't have any cards");
        updateColumnCards(
          dispatch,
          store,
          cardData.columnId,
          moveCard(cards, cardData.id, 1),
        );
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
        const { column } = getColumn(
          store.getState().kanban,
          cardData.columnId,
        );
        const cards = column.cards;
        if (!cards) throw new Error("Column doesn't have any cards");
        updateColumnCards(
          dispatch,
          store,
          cardData.columnId,
          removeCard(cards, cardData.id),
        );
      },
    },
  ];

  return <ActionMenu options={options} />;
}

function Editor(props: {
  cardData: CardData;
  blocked: boolean | undefined;
  isEditing: boolean;
  setIsEditing: (arg: boolean) => void;
}) {
  const { cardData, blocked, isEditing, setIsEditing } = props;
  const dispatch = useAppDispatch();
  const store = useAppStore();
  return (
    <CardEditorPortal
      cardData={cardData}
      setCardData={(card) => {
        const state = store.getState().kanban;
        const { column } = getColumn(state, cardData.columnId);

        const cards = column.cards;
        if (!cards) throw new Error("Column doesn't have any cards");
        const cardIdx = cards.findIndex((c) => c.id === card.id);
        if (cardIdx === -1) throw new Error("Card not found");
        const newCards = [...cards];
        newCards.splice(cardIdx, 1, card);
        updateColumnCards(dispatch, store, cardData.columnId, newCards);
      }}
      blocked={blocked}
      isRedacting={isEditing}
      setIsRedacting={setIsEditing}
    />
  );
}
