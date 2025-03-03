"use client";

import { setKanbanAction } from "@/lib/features/kanban/kanbanSlice";
import { useAppDispatch, useAppStore } from "@/lib/hooks";
import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import axios from "axios";
import React, { useState } from "react";

export default function ManualControl() {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const [id, setId] = useState("");
  return (
    <div>
      <form action="">
        <TextInput
          onChange={(e) => {
            console.log(e.target.value);
            setId(e.target.value);
          }}
          id="manualControl_id"
          label="Project Id"
        ></TextInput>
      </form>
      <TextButton
        onClick={async () => {
          const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
          if (!projectHost) return;
          const data: KanbanState = store.getState().kanban;
          const r = await axios.post(`${projectHost}/create`, data);
        }}
      >
        POST
      </TextButton>
      <TextButton
        onClick={async () => {
          const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
          if (!projectHost) return;
          const data: KanbanState = store.getState().kanban;
          const r = await axios.put(`${projectHost}/update?id=${id}`, data);
        }}
      >
        PUT
      </TextButton>
      <TextButton
        onClick={async () => {
          const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
          if (!projectHost) return;
          const r = await axios.get(`${projectHost}/read?id=${id}`);
          const data: KanbanState = r.data;
          dispatch(setKanbanAction(data));
        }}
      >
        GET
      </TextButton>
      <TextButton
        onClick={() => {
          const projectHost = process.env.NEXT_PUBLIC_PROJECT_HOST;
          if (!projectHost) return;
          axios.delete(`${projectHost}/delete?id=${id}`);
        }}
      >
        DELETE
      </TextButton>
    </div>
  );
}
