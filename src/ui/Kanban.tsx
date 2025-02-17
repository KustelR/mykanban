"use client";
import { useEffect, useRef, useState } from "react";
import CardColumn from "./CardColumn";
import { setKanbanAction } from "@/lib/features/kanban/kanbanSlice";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { nanoid } from "@reduxjs/toolkit";
import PlusIcon from "../../public/plus.svg";

type KanbanProps = {
  defaultColumns?: Array<ColData>;
  className?: string;
  label: string;
};
const someCol = () => {
  return {
    header: "Backlog",
    id: nanoid(),
    cards: [
      {
        title: "Something",
        description: "Lorem ipsum sis dolar amet",
        tags: ["test", "something"],
        id: nanoid(),
      },
    ],
  };
};

export default function Kanban(props: KanbanProps) {
  const { defaultColumns, className, label } = props;
  const [columns, setColumns] = useState(defaultColumns ? defaultColumns : []);
  const store = useAppStore();

  store.subscribe(() => {
    setColumns(store.getState().kanban.columns);
  });
  const dispatch = useAppDispatch();

  return (
    <div
      className={`${className} rounded-2xl border-[1px] p-1 md:p-3 border-neutral-300 dark:border-neutral-700`}
    >
      {columns ? (
        <>
          <h2 className="font-2xl font-bold">KANBAN: {label}</h2>
          {columns.length === 0 && (
            <button
              className="items-center justify-items-center"
              onClick={(e) => {
                const action = setKanbanAction({
                  label: label,
                  columns: [someCol()],
                });
                dispatch(action);
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
                    const action = setKanbanAction({
                      label: label,
                      columns: [someCol(), ...columns],
                    });
                    dispatch(action);
                  }}
                >
                  NEW COLUMN
                </button>
              </li>
              {columns.map((col) => {
                return (
                  <li className="col-span-1 min-w-40 basis-0 grow" key={col.id}>
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
                    const action = setKanbanAction({
                      label: label,
                      columns: [...columns, someCol()],
                    });
                    dispatch(action);
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
    </div>
  );
}
