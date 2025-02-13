"use client";
import { useEffect, useState } from "react";
import CardColumn from "./CardColumn";
import { usePathname } from "next/navigation";

type KanbanProps = {
  defaultColumns?: Array<ColData>;
  className?: string;
  label: string;
};

const initialColumns = [
  {
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
  },
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
  if (!columns) {
    setColumns(initialColumns);
  }
  return (
    <div>
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
