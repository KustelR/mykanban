"use client";
import { useEffect, useRef, useState } from "react";
import CardColumn from "./CardColumn";
import { setKanbanAction } from "@/lib/features/kanban/kanbanSlice";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { nanoid } from "@reduxjs/toolkit";
import PlusIcon from "@public/plus.svg";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { addColumn } from "@/scripts/kanban";
import { ColumnEditorPortal } from "./ColumnEditor";

type KanbanProps = {
  defaultColumns?: Array<ColData>;
  className?: string;
  label: string;
};

export default function Kanban(props: KanbanProps) {
  const { defaultColumns, className, label } = props;
  const [columns, setColumns] = useState(defaultColumns ? defaultColumns : []);
  const store = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [addingDirection, setAddingDirection] = useState<"start" | "end">(
    "start",
  );
  useEffect(() => {
  store.subscribe(() => {
    setColumns(store.getState().kanban.columns);
    });
  });
  const dispatch = useAppDispatch();

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`${className} h-fit rounded-2xl border-[1px] p-1 md:p-3 border-neutral-300 dark:border-neutral-700`}
      >
        {columns ? (
          <>
            <h2 className="font-2xl font-bold">KANBAN: {label}</h2>
            {columns.length === 0 && (
              <button
                className="items-center justify-items-center"
                onClick={(e) => {
                  setAddingDirection("end");
                  setIsAdding(true);
                }}
              >
                <PlusIcon
                  height={50}
                  width={50}
                  className="*:dark:fill-white"
                ></PlusIcon>
              </button>
            )}
            {columns.length > 0 && (
              <ol
                className={`overflow-auto flex flex-row space-x-1 md:space-x-3 `}
                style={{
                  gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                }}
              >
                <li>
                  <button
                    className="hover:bg-black/10 hover:dark:bg-white/10 w-fit h-full [writing-mode:vertical-lr]"
                    onClick={(e) => {
                      setAddingDirection("start");
                      setIsAdding(true);
                    }}
                  >
                    NEW COLUMN
                  </button>
                </li>
                {columns.map((col) => {
                  return (
                    <li
                      className="col-span-1 min-w-40 basis-0 grow"
                      key={col.id}
                    >
                      <CardColumn
                        className="w-full"
                        columns={columns}
                        setColumns={(cols) => {
                          dispatch(
                            setKanbanAction({ label: label, columns: cols }),
                          );
                        }}
                        colData={col}
                      />
                    </li>
                  );
                })}
                <li>
                  <button
                    className="hover:bg-black/10 hover:dark:bg-white/10 w-fit h-full [writing-mode:vertical-lr]"
                    onClick={(e) => {
                      setIsAdding(true);
                      setAddingDirection("end");
                    }}
                  >
                    NEW COLUMN
                  </button>
                </li>
              </ol>
            )}
          </>
        ) : (
          ""
        )}
        {isAdding && (
          <ColumnEditorPortal
            setIsRedacting={setIsAdding}
            setColData={(col) => {
              console.log("runs");
              setColumns(addColumn(columns, col, { place: addingDirection }));
            }}
          />
        )}
      </div>
    </DndProvider>
  );
}
