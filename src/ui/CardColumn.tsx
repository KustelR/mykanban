"use client";

import { useState } from "react";
import { Card } from "./Card";
import { CardEditorPortal } from "./CardEditor";
import { nanoid } from "@reduxjs/toolkit";
import PlusIcon from "../../public/plus.svg";
import Image from "next/image";

export default function CardColumn(props: {
  className?: string;
  colData: ColData;
  setColumns: (arg: Array<ColData>) => void;
  columns: Array<ColData>;
}) {
  const { colData, className, columns, setColumns } = props;
  const [isAdding, setIsAdding] = useState(false);
  let creatingCard: CardData = {
    title: "",
    description: "",
    tags: [],
    id: "-1",
  };
  return (
    <div className={` ${className} px-1 space-y-2`}>
      <h3 className="text-xl font-semibold bg-cyan-700/30 rounded-md px-2">
        {colData.header}
      </h3>
      <ol className="w-full h-full space-y-2">
        {colData.cards.map((card, idx) => {
          return (
            <li key={idx}>
              <Card
                cards={colData.cards}
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
            const newColumns = [...columns];
            const changingColumnIdx = columns.findIndex((col) => {
              return col.id === colData.id;
            });
            if (changingColumnIdx === -1) return;
            const newColumnCards = [...newColumns[changingColumnIdx].cards];
            newColumnCards.push(data);
            newColumns[changingColumnIdx] = {
              ...newColumns[changingColumnIdx],
              ...{ cards: newColumnCards },
            };
            setColumns(newColumns);
          }}
        />
      )}
    </div>
  );
}
