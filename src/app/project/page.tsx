"use client";
import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import { Card } from "@/ui/Card";
import CardColumn from "@/ui/CardColumn";
import Kanban from "@/ui/Kanban";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import { useEffect } from "react";
import axios from "axios";
import { setKanbanAction } from "@/lib/features/kanban/kanbanSlice";

export default function Project() {
  const store = useAppStore();
  const dispatch = useAppDispatch();
  return (
    <div>
      <Kanban
        defaultLabel="TEST"
        className="overflow-x-auto md:max-w-fit"
      ></Kanban>
      <div>
        <form
          action=""
          onSubmit={async (e) => {
            e.preventDefault();
            const host = process.env.NEXT_PUBLIC_PROJECT_HOST;
            if (!host) {
              console.log("post failed");
              return;
            }
            const response = await axios.get(host);
            const name: string = response.data.name;
            const columns: Array<ColData> = [];
            const tags: Array<TagData> = response.data.tags
              ? response.data.tags
              : [];
            const respCols: Array<ColDataFromBackend> = response.data.columns;
            respCols.forEach((col) => {
              if (!col.cards) col.cards = [];
              const respCards: Array<CardDataFromBackend> = col.cards;
              const cards = respCards.map((card) => {
                if (card.tagIds === null) {
                  card.tagIds = [];
                }
                return card as CardData;
              });
              columns.push({ name: col.name, id: col.id, cards: cards });
            });
            dispatch(setKanbanAction({ name, columns, tags }));
          }}
        >
          <TextButton>LOAD</TextButton>
        </form>
        <form
          className="space-y-2"
          action=""
          onSubmit={async (e) => {
            e.preventDefault();
            const kanban = store.getState().kanban;
            const host = process.env.PROJECT_HOST;
            if (!host) {
              console.log("post failed");
              return;
            }
            const response = await axios.post(host, kanban);
            console.log(response);
          }}
        >
          <TextInput id="upload_name" label="Upload name" />
          <TextButton>UPLOAD</TextButton>
        </form>
      </div>
    </div>
  );
}
