import { useEffect, useState } from "react";
import TagList from "./TagList";
import { useAppStore } from "@/lib/hooks";
import { getCard } from "@/lib/features/kanban/utils";
import objectHash from "object-hash";

type CardProps = {
  cardData: CardData;
  debug?: boolean;
};

export function Card(props: CardProps) {
  const { cardData, debug } = props;
  return (
    <>
      <div>
        <section className="rounded-md hover:bg-neutral-300 border-[1px] dark:border-neutral-700 hover:dark:bg-neutral-800 p-2 ">
          <header className="font-bold overflow-hidden line-clamp-3 break-words max-w-[200px]">
            {cardData.name}
          </header>
          <p className="text-wrap break-words line-clamp-3">
            {cardData.description}
          </p>
          <TagList tagIds={cardData.tagIds} />
          {debug && (
            <div className="bg-red-600/30 rounded-md p-1">
              <strong>debug data</strong>
              <ul>
                <li>order: {cardData.order}</li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
