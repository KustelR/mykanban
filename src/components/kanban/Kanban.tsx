"use client";
import { useEffect, useState } from "react";
import Column from "./Column";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import PlusIcon from "@public/plus.svg";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { addColumn } from "@/scripts/kanban";
import { ColumnEditorPortal } from "./editors/ColumnEditor";
import TextButton from "@/shared/TextButton";
import { ProjectEditorPortal } from "./editors/ProjectEditor";
import ColumnControls from "./ColumnControls";
import { requestToApi } from "@/scripts/project";
import { setKanbanAction } from "@/lib/features/kanban/kanbanSlice";

type KanbanProps = {
  defaultColumns?: Array<ColData>;
  className?: string;
  debug?: boolean;
  defaultLabel?: string;
};

export default function Kanban(props: KanbanProps) {
  const { defaultColumns, className, defaultLabel } = props;
  const [columns, setColumns] = useState<Array<ColData> | null | undefined>(
    defaultColumns,
  );
  const [label, setLabel] = useState(defaultLabel);
  const store = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addingDirection, setAddingDirection] = useState<"start" | "end">(
    "start",
  );
  const dispatch = useAppDispatch();
  const [debug, setDebug] = useState(false);
  useEffect(() => {
    store.subscribe(() => {
      const storeStamp = store.getState();
      const data = storeStamp.kanban;
      setLabel(data.name);
      setColumns(data.columns);
    });
  }, []);
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div
          className={`${className} h-fit rounded-2xl border-[1px] p-1 md:p-3 border-neutral-300 dark:border-neutral-700`}
        >
          <h2 className="font-2xl font-bold">KANBAN: {label}</h2>
          {(!columns || columns.length <= 0) && (
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
                className="dark:*:fill-white"
              ></PlusIcon>
            </button>
          )}
          {columns &&
            columns.length > 0 &&
            renderColumnList(
              columns,
              setColumns,
              debug,
              setAddingDirection,
              setIsAdding,
            )}
          <div className="mt-2 border-t-neutral-600 border-t-[1px] p-2">
            <TextButton
              onClick={() => {
                setIsEditing(true);
              }}
            >
              controls
            </TextButton>
          </div>
        </div>
      </DndProvider>
      {isAdding && (
        <ColumnEditorPortal
          setIsRedacting={setIsAdding}
          addColumn={async (name, id, cards) => {
            const projectId = store.getState().projectId;
            const addData = await addColumn(columns ? columns : [], projectId, {
              name: name,
              id: id,
              cards: [],
              order: columns ? columns.length : 1,
            });
            const currentState = store.getState().kanban;
            dispatch(
              setKanbanAction({
                columns: addData.columns,
                tags: currentState.tags ? currentState.tags : [],
                name: name,
              }),
            );
            setColumns(addData.columns);
          }}
        />
      )}
      {isEditing && (
        <ProjectEditorPortal
          toggleDevMode={() => {
            setDebug(!debug);
          }}
          setIsRedacting={setIsEditing}
        />
      )}
    </>
  );
}

function renderColumnList(
  columns: Array<ColData>,
  setColumns: (arg: Array<ColData>) => void,
  debug: boolean | undefined,
  setAddingDirection: (arg: "start" | "end") => void,
  setIsAdding: (arg: boolean) => void,
) {
  return (
    <>
      <ol
        className={`h-96 flex overflow-x-auto overflow-y-hidden flex-row space-x-1 md:space-x-3 `}
      >
        <li>
          <button
            className=" hover:bg-black/10 dark:hover:bg-white/10 w-fit [writing-mode:vertical-lr]"
            onClick={(e) => {
              setAddingDirection("start");
              setIsAdding(true);
            }}
          >
            NEW COLUMN
          </button>
        </li>
        {[...columns]
          .sort((col1, col2) => col1.order - col2.order)
          .map((col) => {
            return (
              <li
                className=" overflow-y-auto min-w-80 basis-0 grow"
                key={col.id}
              >
                <ColumnControls
                  columns={columns}
                  setColumns={setColumns}
                  colData={col}
                >
                  <Column debug={debug} colData={col} />
                </ColumnControls>
              </li>
            );
          })}
        <li>
          <button
            className="hover:bg-black/10 dark:hover:bg-white/10 w-fit [writing-mode:vertical-lr]"
            onClick={(e) => {
              setIsAdding(true);
              setAddingDirection("end");
            }}
          >
            NEW COLUMN
          </button>
        </li>
      </ol>
    </>
  );
}
