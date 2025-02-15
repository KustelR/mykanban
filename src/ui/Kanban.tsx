"use client";
import { useEffect, useRef, useState } from "react";
import CardColumn from "./CardColumn";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { addColumnAction } from "@/lib/features/kanban/kanbanSlice";
import StoreProvider from "@/app/StoreProvider";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/hooks";
import TextButton from "@/shared/TextButton";

type KanbanProps = {
  defaultColumns?: Array<ColData>;
  className?: string;
  label: string;
};
const someCol = {
  header: "Backlog",
  cards: [
    { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
    { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
    { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
    { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
    { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
    { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
    { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
  ],
};
const initialColumns = [
  {
    header: "Planned",
    cards: [
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
    ],
  },
  {
    header: "In work",
    cards: [
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
      { title: "blah", description: "blah", tags: ["blah1", "blah2"] },
    ],
  },
];

export default function Kanban(props: KanbanProps) {
  const { defaultColumns, className, label } = props;
  const [columns, setColumns] = useState(defaultColumns);
  const store = useAppStore();
  store.subscribe(() => {
    setColumns(store.getState().kanban.columns);
  });
  const initialized = useRef(false);
  const dispatch = useAppDispatch();
  if (!initialized.current) {
    initialized.current = true;
  }
  if (!columns) {
    setColumns(initialColumns);
  }
  return (
    <div>
      {" "}
      <TextButton
        onClick={(e) => {
          const action = addColumnAction(someCol);
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
                  <CardColumn header={col.header} cards={col.cards} />
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
