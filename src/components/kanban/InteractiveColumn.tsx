import { useEffect, useState } from "react";
import Column from "./Column";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { getCard, getColumn } from "@/lib/features/kanban/utils";
import { PopupPortal } from "@/shared/Popup";
import ColumnEditor from "./editors/ColumnEditor";
import { useDrop } from "react-dnd";
import { ItemTypes } from "@/Constants";
import { requestToApi } from "@/scripts/project";
import { moveColumn, pushNewCard, removeCard } from "@/scripts/kanban";
import {
  pushCardAction,
  setKanbanAction,
} from "@/lib/features/kanban/kanbanSlice";
import CardEditor from "./editors/CardEditor/CardEditor";

export default function InteractiveColumn(props: {
  id: string;
  debug?: boolean;
}) {
  const { id, debug } = props;
  const [colData, setColData] = useState<ColData | undefined>();
  const store = useAppStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const kanban = store.getState().kanban;
    let columnData: ColData | undefined;
    try {
      columnData = getColumn(kanban, id).column;
    } catch (e) {
      columnData = undefined;
    }
    setColData(columnData);
    store.subscribe(() => {
      const kanban = store.getState().kanban;
      let columnData: ColData | undefined;
      try {
        columnData = getColumn(kanban, id).column;
      } catch (e) {
        columnData = undefined;
      }
      setColData(columnData);
    });
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [droppedElement, setDroppedElement] = useState<{ id: string } | null>(
    null,
  );
  const [{}, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop: (dropped) => {
        if (dropped && "id" in (dropped as any))
          setDroppedElement(dropped as { id: string });
      },
      collect: () => {
        return {};
      },
    }),
    [],
  );

  useEffect(() => {
    if (!droppedElement || !colData) return;
    const kanban = store.getState().kanban;

    const { id } = droppedElement;
    const dropped = getCard(kanban, id).card;
    onCardDrop(dropped, colData, kanban, dispatch);
  }, [droppedElement]);
  if (!colData) return null;
  return (
    <>
      {drop(
        <div className="h-full w-full">
          <Column
            colData={colData}
            debug={debug}
            options={getColOptions(
              colData,
              setIsAdding,
              setIsEditing,
              store,
              dispatch,
            )}
          />
        </div>,
      )}
      <PopupPortal isEditing={isAdding} setIsEditing={setIsAdding}>
        <CardAdder
          setIsAdding={setIsAdding}
          colData={colData}
          dispatch={dispatch}
        />
      </PopupPortal>
      <PopupPortal isEditing={isEditing} setIsEditing={setIsEditing}>
        <ColumnEditor
          defaultCol={colData}
          onSubmit={async (name, id, cards) => {
            const project = store.getState().kanban;
            await updateColumn(
              colData.id,
              project,
              { ...colData, name: name },
              dispatch,
            );
          }}
        />
      </PopupPortal>
    </>
  );
}

async function onCardDrop(
  dropped: CardData,
  colData: ColData,
  kanban: KanbanState,
  dispatch: AppDispatch,
) {
  const columns = kanban.columns;
  const newCols = [...columns];
  const colIdx = newCols.findIndex((c) => c.id === dropped.columnId);
  const oldCol = columns[colIdx];
  if (!oldCol.cards) return;
  if (dropped.columnId === colData.id) {
    return;
  }

  const updated: CardData = (
    await requestToApi(
      "cards/update",
      {
        ...dropped,
        columnId: colData.id,
      },
      "put",
    )
  ).data;
  newCols.splice(colIdx, 1, {
    ...oldCol,
    cards: removeCard(oldCol.cards, dropped.id),
  });

  dispatch(
    setKanbanAction({
      ...kanban,
      columns: pushNewCard(updated, colData.id, newCols),
    }),
  );
}

function CardAdder(props: {
  setIsAdding: (arg: boolean) => void;
  colData: ColData;
  dispatch: AppDispatch;
}) {
  const { setIsAdding, colData, dispatch } = props;
  return (
    <CardEditor
      setIsEditing={setIsAdding}
      setCardData={async (data) => {
        const newCard = (
          await requestToApi(
            "cards/create",
            { ...data, columnId: colData.id },
            "post",
          )
        ).data[0];
        dispatch(
          pushCardAction({
            columnId: colData.id,
            card: newCard,
          }),
        );
      }}
    />
  );
}

async function updateColumn(
  id: string,
  project: KanbanState,
  colData: ColData,
  dispatch: AppDispatch,
) {
  const projectId = project.id;
  const newCol = (
    await requestToApi(
      "columns/update",
      {
        name: colData.name,
        id: id,
        cards: colData.cards,
        order: colData.order,
      },
      "put",
      [{ name: "id", value: projectId }],
    )
  ).data;
  newCol.cards = colData.cards;
  const { idx } = getColumn(project, id);
  const newColumns: ColData[] = [...project.columns];
  newColumns[idx] = newCol;
  dispatch(setKanbanAction({ ...project, columns: newColumns }));
}
function getColOptions(
  colData: ColData,
  setIsAdding: (arg: boolean) => void,
  setIsEditing: (arg: boolean) => void,
  store: AppStore,
  dispatch: AppDispatch,
) {
  return {
    onEdit: () => {
      setIsEditing(true);
    },
    onAdd: () => {
      setIsAdding(true);
    },
    onLeft: () => {
      const kanban = store.getState().kanban;
      const moveData = moveColumn(kanban.columns, colData.id, -1);
      moveData.changed.forEach((item) => {
        requestToApi("columns/update", item, "put", [
          { name: "id", value: kanban.id },
        ]);
      });
      dispatch(
        setKanbanAction({
          ...store.getState().kanban,
          columns: moveData.columns,
        }),
      );
    },
    onRight: () => {
      const kanban = store.getState().kanban;
      const moveData = moveColumn(kanban.columns, colData.id, 1);
      moveData.changed.forEach((item) => {
        requestToApi("columns/update", item, "put", [
          { name: "id", value: kanban.id },
        ]);
      });
      dispatch(
        setKanbanAction({
          ...store.getState().kanban,
          columns: moveData.columns,
        }),
      );
    },
    onDelete: async () => {
      const kanban = store.getState().kanban;
      await requestToApi("columns/delete", { id: colData.id }, "delete", [
        { name: "id", value: kanban.id },
      ]);
      dispatch(
        setKanbanAction({
          ...store.getState().kanban,
          columns: kanban.columns.filter((c) => c.id != colData.id),
        }),
      );
    },
  };
}
