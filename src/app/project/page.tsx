"use client";
import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import { Card } from "@/ui/Card";
import CardColumn from "@/ui/CardColumn";
import Kanban from "@/ui/Kanban";
import { useAppStore } from "@/lib/hooks";
import { useEffect } from "react";
import axios from "axios";

export default function Project() {
  const store = useAppStore();
  return (
    <div>
      <Kanban
        defaultLabel="TEST"
        className="overflow-x-auto md:max-w-fit"
      ></Kanban>
      <div>
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
