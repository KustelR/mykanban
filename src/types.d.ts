import {
  ThunkDispatch,
  UnknownAction,
  Dispatch,
  EnhancedStore,
} from "@reduxjs/toolkit";

declare global {
  type validator = (input: string) => [boolean, string];
  interface CardData {
    name: string;
    description: string;
    tagIds: string[];
    id: string;
    order: number;
    columnId: string;
  }
  interface ColData {
    name: string;
    id: string;
    order: number;
    cards: Array<CardData> | null;
  }
  interface Identified {
    id: string;
  }
  type KanbanState = {
    columns: Array<ColData & Identified>;
    name: string;
    tags: Array<TagData> | null;
  };
  type TagData = {
    name: string;
    color: string;
    id: string;
    cardId: string;
  };
  type ProjectStamp = {
    id: string;
    name?: string;
    lastOpened: number;
  };
  type LastChangedState = {
    timestamp: number;
    hash: string;
    lastAction: string;
  };

  type AppDispatch = ThunkDispatch<
    {
      kanban: KanbanState;
      lastChanged: LastChangedState;
    },
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>;
  type AppStore = EnhancedStore<{
    kanban: KanbanState;
    lastChanged: LastChangedState;
  }>;
}
export {};
