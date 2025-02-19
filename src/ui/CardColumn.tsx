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
  swapColumns,
} from "@/scripts/kanban";
import ArrowLeftIcon from "@public/arrow-left.svg";
import ArrowRightIcon from "@public/arrow-right.svg";
import DeleteIcon from "@public/delete.svg";

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
    if (el && "title" in (el as any))
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
          {colData.header}
        </h3>
        <ul
          className={`${isActive ? "flex" : "hidden"} absolute top-0 right-0 flex-row"`}
        >
          <li>
            <button
              className="h-5 w-5 flex flex-wrap content-center justify-center bg-blue-800 hover:bg-blue-900"
              onClick={() => {
                const colIdx = columns.findIndex(
                  (col) => colData.id === col.id,
                );
                if (colIdx === -1 || colIdx === 0) return;
                const col2Id = columns[colIdx - 1].id;
                setColumns(swapColumns(columns, colData.id, col2Id));
              }}
            >
              <ArrowLeftIcon
                width={16}
                height={16}
                className="*:stroke-white *:fill-transparent"
              ></ArrowLeftIcon>
            </button>
          </li>
          <li>
            <button
              className="h-5 w-5 flex flex-wrap content-center justify-center bg-blue-800 hover:bg-blue-900"
              onClick={() => {
                const colIdx = columns.findIndex(
                  (col) => colData.id === col.id,
                );
                if (colIdx === -1 || colIdx === columns.length - 1) return;
                const col2Id = columns[colIdx + 1].id;
                setColumns(swapColumns(columns, colData.id, col2Id));
              }}
            >
              <ArrowRightIcon
                width={16}
                height={16}
                className="*:stroke-white *:fill-transparent"
              ></ArrowRightIcon>
            </button>
          </li>
          <li>
            <button
              className="h-5 w-5 flex flex-wrap content-center justify-center bg-red-600/50 hover:bg-red-700/50"
              onClick={(e) => {
                setColumns(removeColumn(colData.id, columns));
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
            title: "",
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
    </div>,
  );
}
