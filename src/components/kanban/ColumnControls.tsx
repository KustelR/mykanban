import { ItemTypes } from "@/Constants";
import { moveColumn, pushNewCard, removeCard } from "@/scripts/kanban";
import React, { ReactNode, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import ColumnEditor, { ColumnEditorPortal } from "./editors/ColumnEditor";
import PlusIcon from "@public/plus.svg";

import ArrowLeftIcon from "@public/arrow-left.svg";
import ArrowRightIcon from "@public/arrow-right.svg";
import DeleteIcon from "@public/delete.svg";
import ChangeIcon from "@public/change.svg";
import ActionMenu from "../ui/ActionMenu";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import {
  pushCardAction,
  setKanbanAction,
} from "@/lib/features/kanban/kanbanSlice";
import { requestToApi } from "@/scripts/project";
import { getCard, getColumn } from "@/lib/features/kanban/utils";
import { PopupPortal } from "@/shared/Popup";
import CardEditor from "./editors/CardEditor/CardEditor";
import CardColumn from "./Column";

type ColumnControlProps = {
  columns: ColData[];
  colData: ColData;
  isDebug?: boolean;
  className?: string;
};

export default function ColumnControls(props: ColumnControlProps) {
  const { isDebug, colData, columns, className } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const [droppedElement, setDroppedElement] = useState<{ id: string } | null>(
    null,
  );
  const [{ el }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: () => {
        setIsDropped(true);
      },
      collect: (monitor) => ({
        el: monitor.getItem(),
      }),
    }),
    [],
  );

  useEffect(() => {
    const f = async () => {
      if (!isDropped) return;
      if (!droppedElement) return;
      const { id } = droppedElement as { id: string };
      const dropped = getCard(store.getState().kanban, id).card;
      if (dropped.columnId) {
        const newCols = [...columns];
        const colIdx = newCols.findIndex((c) => c.id === dropped.columnId);
        const oldCol = columns[colIdx];
        if (!oldCol.cards) return;
        if (dropped.columnId === colData.id) {
          return;
        }
        const updated: CardData = (
          await requestToApi(
            "cards/update",
            {
              ...dropped,
              columnId: colData.id,
            },
            "put",
          )
        ).data;
        newCols.splice(colIdx, 1, {
          ...oldCol,
          cards: removeCard(oldCol.cards, dropped.id),
        });
        dispatch(
          setKanbanAction({
            ...store.getState().kanban,
            columns: pushNewCard(updated, colData.id, newCols),
          }),
        );
      }
    };
    f();
    setIsDropped(false);
  }, [isDropped]);

  useEffect(() => {
    if (el && "id" in (el as any)) setDroppedElement(el as { id: string });
  }, [el]);

  return (
    <>
      {drop(
        <div
          className={className}
          onMouseEnter={() => {
            setIsActive(true);
          }}
          onMouseLeave={() => {
            setIsActive(false);
          }}
        >
          <CardColumn debug={isDebug} colData={colData} className={className}>
            <AddCardButton setIsAdding={setIsAdding} />
          </CardColumn>
          {isActive &&
            renderActionMenu(columns, store, dispatch, setIsEditing, colData)}
        </div>,
      )}
      {isAdding && (
        <PopupPortal setIsEditing={setIsAdding}>
          <CardEditor
            setIsEditing={setIsAdding}
            setCardData={async (data) => {
              const newCard = (
                await requestToApi(
                  "cards/create",
                  { ...data, columnId: colData.id },
                  "post",
                )
              ).data[0];
              dispatch(
                pushCardAction({
                  columnId: colData.id,
                  card: newCard,
                }),
              );
            }}
          />
        </PopupPortal>
      )}
      {isEditing && (
        <PopupPortal setIsEditing={setIsEditing}>
          <ColumnEditor
            defaultCol={colData}
            addColumn={async (name, id, cards) => {
              const projectId = store.getState().kanban.id;
              const newCol = (
                await requestToApi(
                  "columns/update",
                  {
                    name: name,
                    id: colData.id,
                    cards: colData.cards,
                    order: colData.order,
                  },
                  "put",
                  [{ name: "id", value: projectId }],
                )
              ).data;
              console.log(newCol);
              newCol.cards = colData.cards;
              const state = store.getState().kanban;
              const { idx } = getColumn(state, colData.id);
              const newColumns: ColData[] = [...state.columns];
              newColumns[idx] = newCol;
              dispatch(setKanbanAction({ ...state, columns: newColumns }));
            }}
          />
        </PopupPortal>
      )}
    </>
  );
}

function renderActionMenu(
  columns: Array<ColData>,
  store: AppStore,
  dispatch: AppDispatch,
  setIsEditing: (arg: boolean) => void,
  colData: ColData,
) {
  const options = [
    {
      icon: ArrowLeftIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const projectId = store.getState().kanban.id;
        const moveData = moveColumn(columns, colData.id, -1);
        moveData.changed.forEach((item) => {
          requestToApi("columns/update", item, "put", [
            { name: "id", value: projectId },
          ]);
        });
        dispatch(
          setKanbanAction({
            ...store.getState().kanban,
            columns: moveData.columns,
          }),
        );
      },
    },
    {
      icon: ArrowRightIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const projectId = store.getState().kanban.id;
        const moveData = moveColumn(columns, colData.id, 1);
        moveData.changed.forEach((item) => {
          requestToApi("columns/update", item, "put", [
            { name: "id", value: projectId },
          ]);
        });
        dispatch(
          setKanbanAction({
            ...store.getState().kanban,
            columns: moveData.columns,
          }),
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
      callback: async () => {
        const projectId = store.getState().kanban.id;
        await requestToApi("columns/delete", { id: colData.id }, "delete", [
          { name: "id", value: projectId },
        ]);
        dispatch(
          setKanbanAction({
            ...store.getState().kanban,
            columns: columns.filter((c) => c.id != colData.id),
          }),
        );
      },
    },
  ];

  return <ActionMenu options={options} />;
}

function AddCardButton(props: { setIsAdding: (arg: boolean) => void }) {
  const { setIsAdding } = props;
  return (
    <button
      onClick={(e) => {
        setIsAdding(true);
      }}
      className="cursor-pointer flex flex-row space-x-2 w-full"
    >
      <PlusIcon
        className="*:fill-neutral-600 dark:*:fill-neutral-400"
        width={20}
        height={20}
      />{" "}
      <div>Add new card</div>
    </button>
  );
}
