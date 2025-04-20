import React, { ReactNode, useState } from "react";
import ChangeIcon from "@public/change.svg";
import ArrowUpIcon from "@public/arrow-up.svg";
import ArrowDownIcon from "@public/arrow-down.svg";
import DeleteIcon from "@public/delete.svg";
import { moveCard, removeCard } from "@/scripts/kanban";
import ActionMenu from "../ui/ActionMenu";
import CardEditor from "./editors/CardEditor";
import { useDrag } from "react-dnd";
import { ItemTypes } from "@/Constants";
import { getColumn } from "@/lib/features/kanban/utils";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { setColumnCardsAction } from "@/lib/features/kanban/kanbanSlice";
import { requestToApi } from "@/scripts/project";
import { CardViewPortal } from "./CardView";
import { PopupPortal } from "@/shared/Popup";

type CardActionsProps = {
  children?: ReactNode;
  blocked?: boolean;
  cardData: CardData;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default function CardActions(props: CardActionsProps) {
  const { children, blocked, cardData, onClick } = props;

  const [isActive, setIsActive] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
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
    <>
      {drag(
        <div
          className={`${isDragging ? "cursor-move" : "cursor-pointer"} h-full relative w-full`}
          onClick={() => {
            setIsViewing(true);
          }}
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
      {isViewing && (
        <CardViewPortal card={cardData} setIsVisible={setIsViewing} />
      )}
      {isEditing && <Editor cardData={cardData} setIsEditing={setIsEditing} />}
    </>
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
        const moveResult = moveCard(cards, cardData.id, -1);
        dispatch(
          setColumnCardsAction({
            id: cardData.columnId,
            cards: moveResult.cards,
          }),
        );
        moveResult.changed?.forEach((c) =>
          requestToApi("cards/update", c, "put"),
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
        const moveResult = moveCard(cards, cardData.id, 1);
        dispatch(
          setColumnCardsAction({
            id: cardData.columnId,
            cards: moveResult.cards,
          }),
        );
        moveResult.changed?.forEach((c) => {
          requestToApi("cards/update", c, "put");
        });
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
        requestToApi("cards/delete", { id: cardData.id }, "delete");
        dispatch(
          setColumnCardsAction({
            id: cardData.columnId,
            cards: removeCard(cards, cardData.id),
          }),
        );
      },
    },
  ];

  return <ActionMenu options={options} />;
}

function Editor(props: {
  cardData: CardData;
  setIsEditing: (arg: boolean) => void;
}) {
  const { cardData, setIsEditing } = props;
  const dispatch = useAppDispatch();
  const store = useAppStore();
  return (
    <PopupPortal setIsEditing={setIsEditing}>
      <CardEditor
        defaultCard={cardData}
        setCardData={(card) => {
          const state = store.getState().kanban;
          const { column } = getColumn(state, cardData.columnId);

          const cards = column.cards;
          if (!cards) throw new Error("Column doesn't have any cards");
          const cardIdx = cards.findIndex((c) => c.id === card.id);
          if (cardIdx === -1) throw new Error("Card not found");
          const newCards = [...cards];
          newCards.splice(cardIdx, 1, card);
          requestToApi("cards/update", card, "put");
          dispatch(
            setColumnCardsAction({
              id: cardData.columnId,
              cards: newCards,
            }),
          );
        }}
      />
    </PopupPortal>
  );
}
