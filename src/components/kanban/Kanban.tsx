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
import { setKanbanAction } from "@/lib/features/kanban/kanbanSlice";
import formatDate from "@/shared/formatDate";

type KanbanProps = {
  defaultColumns?: Array<ColData>;
  className?: string;
  debug?: boolean;
  defaultLabel?: string;
};

export default function Kanban(props: KanbanProps) {
  const { defaultColumns, className, defaultLabel } = props;
  /*
  const [columns, setColumns] = useState<Array<ColData> | null | undefined>(
    defaultColumns,
  );
  const [label, setLabel] = useState(defaultLabel);
  */
  const store = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addingDirection, setAddingDirection] = useState<"start" | "end">(
    "start",
  );
  const [kanban, setKanban] = useState<KanbanState | null>(null);
  const dispatch = useAppDispatch();
  const [debug, setDebug] = useState(false);
  useEffect(() => {
    store.subscribe(() => {
      const storeStamp = store.getState();
      const data = storeStamp.kanban;
      setKanban(data);
    });
  }, []);
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div
          className={`${className} h-fit rounded-2xl border-[1px] p-1 md:p-3 border-neutral-300 dark:border-neutral-700`}
        >
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">{kanban?.name}</h2>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 space-x-2">
              <div>
                created at{" "}
                {kanban?.createdAt
                  ? formatDate(kanban.createdAt)
                  : "loading..."}{" "}
                by {kanban?.createdBy ? kanban.createdBy : "loading..."}
              </div>
              <div>
                updated at{" "}
                {kanban?.createdAt
                  ? formatDate(kanban.updatedAt)
                  : "loading..."}{" "}
                by {kanban?.updatedBy ? kanban.updatedBy : "loading..."}
              </div>
            </div>
          </div>
          {(!kanban?.columns || kanban.columns.length <= 0) && (
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
          {kanban?.columns &&
            kanban.columns.length > 0 &&
            renderColumnList(
              kanban.columns,
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
            const addData = await addColumn(
              kanban?.columns ? kanban.columns : [],
              projectId,
              {
                name: name,
                id: id,
                cards: [],
                order: kanban?.columns ? kanban.columns.length : 1,
                createdAt: 0,
                updatedAt: 0,
                createdBy: "",
                updatedBy: "",
              },
            );
            const currentState = store.getState().kanban;
            dispatch(
              setKanbanAction({
                columns: addData.columns,
                tags: currentState.tags ? currentState.tags : [],
                name: name,
                createdAt: 0,
                updatedAt: 0,
                createdBy: "",
                updatedBy: "",
              }),
            );
            dispatch(
              setKanbanAction({ ...currentState, columns: addData.columns }),
            );
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
  debug: boolean | undefined,
  setAddingDirection: (arg: "start" | "end") => void,
  setIsAdding: (arg: boolean) => void,
) {
  return (
    <div className="flex h-96 w-full space-x-3">
      <ol
        className={`h-full w-full flex overflow-x-scroll overflow-y-hidden flex-row space-x-1 md:space-x-3 `}
      >
        {[...columns]
          .sort((col1, col2) => col1.order - col2.order)
          .map((col) => {
            return (
              <li
                className=" overflow-y-auto min-w-80 basis-0 grow"
                key={col.id}
              >
                <ColumnControls columns={columns} colData={col}>
                  <Column debug={debug} colData={col} />
                </ColumnControls>
              </li>
            );
          })}
      </ol>
      <div className=" min-w-[24px] h-full bg-emerald-600/30 rounded-md">
        <button
          className="hover:bg-black/10 w-full rounded-md h-full cursor-pointer dark:hover:bg-white/10 [writing-mode:vertical-lr]"
          onClick={(e) => {
            setIsAdding(true);
            setAddingDirection("end");
          }}
        >
          ADD COLUMN
        </button>
      </div>
    </div>
  );
}
