"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";
import { CardEditorPortal } from "./CardEditor";
import { nanoid } from "@reduxjs/toolkit";
import PlusIcon from "@public/plus.svg";
import { useDrop } from "react-dnd";
import { ItemTypes } from "@/Constants";
import {
  moveColumn,
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
  debug?: boolean;
}) {
  const { colData, className, columns, setColumns, debug } = props;
  const [isAdding, setIsAdding] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
      const newCols = removeCard(dropped.id, dropped.columnId, columns);
      setColumns(pushNewCard(dropped, colData.id, newCols));
    } else {
      setColumns(pushNewCard(dropped, colData.id, columns));
    }
    setIsDropped(false);
  }, [isDropped]);

  useEffect(() => {
    if (el && "name" in (el as any)) setDroppedElement(el as CardData);
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
        {colData.cards &&
          [...colData.cards]
            .sort((card1, card2) => {
              return card1.order - card2.order;
            })
            .map((card) => {
              return (
                <li key={card.id}>
                  <Card
                    cards={colData.cards ? colData.cards : []}
                    debug={debug}
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
      {debug && (
        <div className="rounded-md bg-red-600/30 p-1">
          <strong>debug data</strong>
          <ul>
            <li>order: {colData.order}</li>
          </ul>
        </div>
      )}
      {isAdding && (
        <CardEditorPortal
          isRedacting={isAdding}
          setIsRedacting={setIsAdding}
          cardData={{
            name: "",
            description: "",
            tagIds: [],
            order: colData.cards ? colData.cards.length : 0,
            id: nanoid(),
            columnId: colData.id,
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
          addColumn={(name, id, cards) => {
            setColumns(
              replaceColumn(
                colData.id,
                {
                  name: name,
                  id: id,
                  cards: colData.cards,
                  order: colData.order,
                },
                columns,
              ),
            );
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
        setColumns(moveColumn(columns, colData.id, -1));
      },
    },
    {
      icon: ArrowRightIcon,
      className: "bg-blue-800 hover:bg-blue-900",
      callback: () => {
        setColumns(moveColumn(columns, colData.id, 1));
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
