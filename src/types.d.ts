import {
  ThunkDispatch,
  UnknownAction,
  Dispatch,
  EnhancedStore,
} from "@reduxjs/toolkit";

declare global {
  type validator = (input: string) => [boolean, string];
  interface Metadata {
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    updatedBy: string;
  }
  interface CardData extends Metadata {
    name: string;
    description: string;
    tagIds: string[];
    id: string;
    order: number;
    columnId: string;
  }
  interface ColData extends Metadata {
    name: string;
    id: string;
    order: number;
    cards: Array<CardData> | null;
  }
  interface Identified {
    id: string;
  }
  type KanbanState = Metadata & {
    columns: Array<ColData & Identified>;
    name: string;
    tags: Array<TagData> | null;
    lastAction?: string;
  };
  type TagData = Metadata & {
    name: string;
    color: string;
    id: string;
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

  type AppDispatch = ThunkDispatch<StoredState, undefined, UnknownAction> &
    Dispatch<UnknownAction>;
  type AppStore = EnhancedStore<StoredState>;
}
export {};

type StoredState = {
  kanban: KanbanState;
  lastChanged: LastChangedState;
  projectId: string;
};
