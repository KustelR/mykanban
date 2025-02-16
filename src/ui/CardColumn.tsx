"use client";

import { useState } from "react";
import { Card } from "./Card";
import { CardEditorPortal } from "./CardEditor";

export default function CardColumn(props: {
  className?: string;
  colData: ColData;
  setColumns: (arg: Array<ColData>) => void;
  columns: Array<ColData>;
}) {
  const { colData, className, columns, setColumns } = props;
  const [isAdding, setIsAdding] = useState(false);
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
            className="bg-red-600 min-w-10 h-10"
          ></button>
        </li>
      </ol>
    </div>
  );
}
