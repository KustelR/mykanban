"use client";
import { useEffect, useRef, useState } from "react";
import CardColumn from "./CardColumn";
import { setKanbanAction } from "@/lib/features/kanban/kanbanSlice";
import StoreProvider from "@/app/StoreProvider";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import TextButton from "@/shared/TextButton";
import { nanoid } from "@reduxjs/toolkit";

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
        title: "blah",
        description: "blah",
        tags: ["blah1", "blah2"],
        id: "dsgsdfg",
      },
      {
        title: "blah",
        description: "blah",
        tags: ["blah1", "blah2"],
        id: "fdsgfdsg",
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
    <div>
      <TextButton
        onClick={(e) => {
          const action = setKanbanAction({
            label: label,
            columns: [...columns, someCol()],
          });
          dispatch(action);
        }}
      >
        Add column
      </TextButton>
      {columns ? (
        <>
          <h2 className="font-2xl font-bold">KANBAN: {label}</h2>
          <ol
            className={`${className} grid space-x-3 overflow-scroll rounded-2xl border-[1px] p-3 border-neutral-300 dark:border-neutral-700`}
            style={{
              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
            }}
          >
            {columns.map((col, idx) => {
              return (
                <li className="col-span-1" key={idx}>
                  <CardColumn
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
          </ol>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
