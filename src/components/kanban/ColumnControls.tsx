import { ItemTypes } from "@/Constants";
import {
  moveColumn,
  pushNewCard,
  removeCard,
  removeColumn,
  replaceColumn,
} from "@/scripts/kanban";
import React, { ReactNode, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { ColumnEditorPortal } from "./editors/ColumnEditor";
import PlusIcon from "@public/plus.svg";
import { CardEditorPortal } from "./editors/CardEditor";
import { nanoid } from "@reduxjs/toolkit";

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

type ColumnControlProps = {
  columns: ColData[];
  setColumns: (arg: ColData[]) => void;
  children: ReactNode;
  colData: ColData;
};

export default function ColumnControls(props: ColumnControlProps) {
  const { children, colData, columns, setColumns } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const [droppedElement, setDroppedElement] = useState<CardData | null>(null);
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
    if (!isDropped) return;
    if (!droppedElement) return;
    const dropped = droppedElement as CardData;
    if (dropped.columnId) {
      const newCols = [...columns];
      const colIdx = newCols.findIndex((c) => c.id === dropped.columnId);
      const oldCol = columns[colIdx];
      if (!oldCol.cards) return;
      requestToApi(
        "cards/update",
        {
          ...dropped,
          columnId: colData.id,
          order: colData.cards ? colData.cards.length + 1 : 1,
        },
        "put",
      );
      newCols.splice(colIdx, 1, {
        ...oldCol,
        cards: removeCard(oldCol.cards, dropped.id),
      });
      dispatch(
        setKanbanAction({
          ...store.getState().kanban,
          columns: pushNewCard(dropped, colData.id, newCols),
        }),
      );
    }
    setIsDropped(false);
  }, [isDropped]);

  useEffect(() => {
    if (el && "name" in (el as any)) setDroppedElement(el as CardData);
  }, [el]);

  return (
    <>
      <div className="relative w-full h-full">
        {drop(
          <div className="h-full">
            {children}
            <button
              onClick={(e) => {
                setIsAdding(true);
              }}
              className="mt-2 place-content-center flex-wrap flex hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full rounded-md h-14"
            >
              <PlusIcon
                className="*:fill-neutral-600 *:dark:fill-neutral-400"
                width={42}
                height={42}
              />
            </button>
          </div>,
        )}
        <div
          style={{ height: "20px" }}
          className="absolute w-full top-0 right-1 overflow-visible"
          onMouseEnter={() => {
            setIsActive(true);
          }}
          onMouseLeave={() => {
            setIsActive(false);
          }}
        >
          {isActive &&
            renderActionMenu(columns, store, setColumns, setIsEditing, colData)}
        </div>
      </div>
      {isAdding && (
        <CardEditorPortal
          isRedacting={isAdding}
          setIsRedacting={setIsAdding}
          cardData={{
            name: "",
            description: "",
            tagIds: [],
            order: colData.cards ? colData.cards.length + 1 : 1,
            id: nanoid(),
            columnId: colData.id,
          }}
          setCardData={(data) => {
            requestToApi("cards/create", data, "post");
            dispatch(
              pushCardAction({
                columnId: colData.id,
                card: data,
              }),
            );
          }}
        />
      )}
      {isEditing && (
        <ColumnEditorPortal
          setIsRedacting={setIsEditing}
          colData={colData}
          addColumn={(name, id, cards) => {
            const projectId = store.getState().projectId;
            requestToApi(
              "columns/update",
              {
                name: name,
                id: colData.id,
                cards: colData.cards,
                order: colData.order,
              },
              "put",
              [{ name: "id", value: projectId }],
            );
            setColumns(
              replaceColumn(
                colData.id,
                {
                  name: name,
                  id: colData.id,
                  cards: colData.cards,
                  order: colData.order,
                },
                columns,
              ),
            );
          }}
        />
      )}
    </>
  );
}

function renderActionMenu(
  columns: Array<ColData>,
  store: AppStore,
  setColumns: (arg: Array<ColData>) => void,
  setIsEditing: (arg: boolean) => void,
  colData: ColData,
) {
  const options = [
    {
      icon: ArrowLeftIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const projectId = store.getState().projectId;
        const moveData = moveColumn(columns, colData.id, -1);
        setColumns(moveData.columns);
        moveData.changed.forEach((item) => {
          requestToApi("columns/update", item, "put", [
            { name: "id", value: projectId },
          ]);
        });
      },
    },
    {
      icon: ArrowRightIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const projectId = store.getState().projectId;
        const moveData = moveColumn(columns, colData.id, 1);
        setColumns(moveData.columns);
        moveData.changed.forEach((item) => {
          requestToApi("columns/update", item, "put", [
            { name: "id", value: projectId },
          ]);
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
        const projectId = store.getState().projectId;
        requestToApi("columns/delete", { id: colData.id }, "delete", [
          { name: "id", value: projectId },
        ]);
        setColumns(removeColumn(colData.id, columns));
      },
    },
  ];

  return <ActionMenu options={options} />;
}
