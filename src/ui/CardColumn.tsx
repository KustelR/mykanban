"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";
import { CardEditorPortal } from "./CardEditor";
import { nanoid } from "@reduxjs/toolkit";
import PlusIcon from "@public/plus.svg";
import { useDrop } from "react-dnd";
import { ItemTypes } from "@/Constants";
import {
  pushNewCard,
  removeCard,
  removeColumn,
  replaceColumn,
  swapColumns,
} from "@/scripts/kanban";
import ArrowLeftIcon from "@public/arrow-left.svg";
import ArrowRightIcon from "@public/arrow-right.svg";
import DeleteIcon from "@public/delete.svg";
import ChangeIcon from "@public/change.svg";
import { ColumnEditorPortal } from "./ColumnEditor";
import ActionMenu from "./ActionMenu";

export default function CardColumn(props: {
  className?: string;
  colData: ColData;
  setColumns: (arg: Array<ColData>) => void;
  columns: Array<ColData>;
}) {
  const { colData, className, columns, setColumns } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [droppedElement, setDroppedElement] = useState<{
    id: string;
    colId: string;
  } | null>(null);
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
    if (dropped.colId) {
      const newCols = removeCard(dropped.id, dropped.colId, columns);
      setColumns(pushNewCard(dropped, colData.id, newCols));
    } else {
      setColumns(pushNewCard(dropped, colData.id, columns));
    }
    setIsDropped(false);
  }, [isDropped]);

  useEffect(() => {
    if (el && "name" in (el as any))
      setDroppedElement(el as { id: string; colId: string });
  }, [el]);

  return drop(
    <div className={` ${className} px-1 space-y-2`}>
      <div
        className="relative h-fit"
        onMouseEnter={() => {
          setIsActive(true);
        }}
        onMouseLeave={() => {
          setIsActive(false);
        }}
      >
        <h3 className="text-xl font-semibold bg-cyan-700/30 rounded-md px-2">
          {colData.name}
        </h3>
        {isActive &&
          renderActionMenu(columns, setColumns, setIsEditing, colData)}
      </div>
      <ol className="w-full h-full space-y-2">
        {colData.cards.map((card) => {
          return (
            <li key={card.id}>
              <Card
                cards={colData.cards}
                columns={columns}
                setColumns={setColumns}
                setCards={(newCards) => {
                  const colIdx = columns.findIndex((col) => {
                    return col.id === colData.id;
                  });
                  const newColumns: Array<ColData> = [...columns];
                  newColumns.splice(colIdx, 1, {
                    ...colData,
                    ...{ cards: newCards },
                  });
                  setColumns(newColumns);
                }}
                cardData={card}
              />
            </li>
          );
        })}
        <li>
          <button
            onClick={(e) => {
              setIsAdding(true);
            }}
            className=" place-content-center flex-wrap flex hover:bg-neutral-100 dark:hover:bg-neutral-800 w-full rounded-md h-14"
          >
            <PlusIcon
              className="*:fill-neutral-600 *:dark:fill-neutral-400"
              width={42}
              height={42}
            />
          </button>
        </li>
      </ol>
      {isAdding && (
        <CardEditorPortal
          isRedacting={isAdding}
          setIsRedacting={setIsAdding}
          cardData={{
            name: "",
            description: "",
            tags: [],
            id: nanoid(),
            colId: colData.id,
          }}
          setCardData={(data) => {
            setColumns(pushNewCard(data, colData.id, columns));
          }}
        />
      )}
      {isEditing && (
        <ColumnEditorPortal
          setIsRedacting={setIsEditing}
          colData={colData}
          setColData={(data) => {
            setColumns(replaceColumn(colData.id, data, columns));
          }}
        />
      )}
    </div>,
  );
}

function renderActionMenu(
  columns: Array<ColData>,
  setColumns: (arg: Array<ColData>) => void,
  setIsEditing: (arg: boolean) => void,
  colData: ColData,
) {
  const options = [
    {
      icon: ArrowLeftIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const colIdx = columns.findIndex((col) => colData.id === col.id);
        if (colIdx === -1 || colIdx === 0) return;
        const col2Id = columns[colIdx - 1].id;
        setColumns(swapColumns(columns, colData.id, col2Id));
      },
    },
    {
      icon: ArrowRightIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        const colIdx = columns.findIndex((col) => colData.id === col.id);
        if (colIdx === -1 || colIdx === columns.length - 1) return;
        const col2Id = columns[colIdx + 1].id;
        setColumns(swapColumns(columns, colData.id, col2Id));
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
        setColumns(removeColumn(colData.id, columns));
      },
    },
  ];

  return <ActionMenu options={options} />;
}
