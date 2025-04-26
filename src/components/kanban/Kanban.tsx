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
import DropIcon from "@public/arrow_down-simple.svg";

type KanbanProps = {
  defaultColumns?: Array<ColData>;
  className?: string;
  debug?: boolean;
  defaultLabel?: string;
};

export default function Kanban(props: KanbanProps) {
  const { defaultColumns, className, defaultLabel } = props;
  const store = useAppStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [kanban, setKanban] = useState<KanbanState | null>(null);
  const dispatch = useAppDispatch();
  const [debug, setDebug] = useState(false);
  const [openedSettings, setOpenedSettings] = useState(false);
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
        <div className={`${className} flex flex-col p-3 space-y-3`}>
          <div className="flex flex-row space-x-5">
            <h2 className="text-4xl">{kanban?.name}</h2>
            <div className="relative justify-center flex flex-row space-x-2">
              <button
                className="cursor-pointer dark:stroke-white stroke-2"
                onClick={() => {
                  setOpenedSettings(!openedSettings);
                }}
              >
                <DropIcon />
              </button>
              <select
                className={
                  (openedSettings ? "visible" : "invisible") +
                  " p-2 bg-neutral-200 dark:bg-neutral-800"
                }
                defaultValue="void"
                onChange={(e) => {
                  setOpenedSettings(!openedSettings);
                  switch (e.target.value) {
                    case "adding":
                      setIsAdding(true);
                      break;
                    case "editor":
                      setIsEditing(true);
                  }
                  e.target.value = "void";
                }}
              >
                <option value="void">Choose action</option>
                <option value="editor">open editor</option>
                <option value="adding">add column</option>
              </select>
            </div>
          </div>
          {kanban?.columns &&
            kanban.columns.length > 0 &&
            renderColumnList(kanban.columns, debug)}
          <div className="text-sm text-neutral-500 dark:text-neutral-400 space-x-2">
            <div>
              created at{" "}
              {kanban?.createdAt ? formatDate(kanban.createdAt) : "loading..."}{" "}
              by {kanban?.createdBy ? kanban.createdBy : "loading..."}
            </div>
            <div>
              updated at{" "}
              {kanban?.createdAt ? formatDate(kanban.updatedAt) : "loading..."}{" "}
              by {kanban?.updatedBy ? kanban.updatedBy : "loading..."}
            </div>
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

function renderColumnList(columns: Array<ColData>, debug: boolean | undefined) {
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
    </div>
  );
}
