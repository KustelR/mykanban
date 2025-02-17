"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";
import { CardEditorPortal } from "./CardEditor";
import { nanoid } from "@reduxjs/toolkit";
import PlusIcon from "@public/plus.svg";
import Image from "next/image";
import { useDrop } from "react-dnd";
import { ItemTypes } from "@/Constants";

export default function CardColumn(props: {
  className?: string;
  colData: ColData;
  setColumns: (arg: Array<ColData>) => void;
  columns: Array<ColData>;
}) {
  const { colData, className, columns, setColumns } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
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
    //dconsole.log(droppedElement, columns, isDropped);
    if (!isDropped) return;
    if (
      !(droppedElement && "id" in droppedElement && "colId" in droppedElement)
    )
      return;
    const newColumns = [...columns];
    const oldColIdx = columns.findIndex((col) => {
      //console.log(col, droppedElement.colId);
      return col.id === droppedElement.colId;
    });
    if (oldColIdx === -1) throw new Error("No column was found");
    const card: CardData | undefined = columns[oldColIdx].cards.find((card) => {
      return card.id === droppedElement.id;
    });
    if (!card) throw new Error("No card was found");
    const cards = columns[oldColIdx].cards.filter((card1) => {
      return card1.id !== droppedElement.id;
    });
    newColumns[oldColIdx] = { ...columns[oldColIdx], cards: cards };
    setColumns(newColumns);
    pushNewCard(card, colData, newColumns, setColumns);
    setIsDropped(false);
  }, [isDropped]);

  useEffect(() => {
    if (el && "id" in (el as any) && "colId" in (el as any))
      setDroppedElement(el as { id: string; colId: string });
  }, [el]);

  return drop(
    <div className={` ${className} px-1 space-y-2`}>
      <h3 className="text-xl font-semibold bg-cyan-700/30 rounded-md px-2">
        {colData.header}
      </h3>
      <ol className="w-full h-full space-y-2">
        {colData.cards.map((card) => {
          return (
            <li key={card.id}>
              <Card
                cards={colData.cards}
                colId={colData.id}
                setCards={(newCards) => {
                  const colIdx = columns.findIndex((col) => {
                    return col.id === colData.id;
                  });
                  console.log();
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
          cardData={{ title: "", description: "", tags: [], id: nanoid() }}
          setCardData={(data) => {
            pushNewCard(data, colData, columns, setColumns);
          }}
        />
      )}
    </div>,
  );
}

function pushNewCard(
  card: CardData,
  colData: ColData,
  columns: Array<ColData>,
  setColumns: (cols: Array<ColData>) => void,
) {
  const newColumns = [...columns];
  const changingColumnIdx = columns.findIndex((col) => {
    return colData.id === col.id;
  });
  if (changingColumnIdx === -1) return;
  const newColumnCards = [...newColumns[changingColumnIdx].cards];
  newColumnCards.push(card);
  newColumns[changingColumnIdx] = {
    ...newColumns[changingColumnIdx],
    ...{ cards: newColumnCards },
  };
  setColumns(newColumns);
}
