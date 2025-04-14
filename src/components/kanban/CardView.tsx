import Popup from "@/shared/Popup";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import formatDate from "@/shared/formatDate";

export default function CardView(props: { card: CardData }) {
  const { card } = props;
  return (
    <section
      className="min-h-52 bg-neutral-100 dark:bg-neutral-900 border-[1px] m-1 md:m-0 md:w-fit md:max-w-[800px] border-neutral-600 p-2 rounded-md space-y-2"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div>
        <div className="text-white bg-cyan-900/50 px-1 rounded-md space-x-3 p-1">
          <h1 className="font-semibold inline">
            <strong>{card.name}</strong>
          </h1>
          <span className="text-sm space-x-2">
            <span className="flex flex-row *:block">
              <span>{formatDate(card.createdAt)}</span>
              &nbsp;
              <span>({formatDate(card.updatedAt)})</span>
            </span>
          </span>
        </div>
        <span className="text-sm text-neutral-500">
          by &nbsp;
          <span>{card.createdBy}</span>
          &nbsp;
          <span className="">(updated by {card.updatedBy})</span>
        </span>
      </div>
      <p>{card.description}</p>
    </section>
  );
}

export function CardViewPortal(props: {
  card: CardData;
  setIsVisible: (arg: boolean) => void;
}) {
  const { card, setIsVisible } = props;
  return createPortal(
    <Popup setIsActive={setIsVisible}>
      <CardView card={card}></CardView>
    </Popup>,
    document.body,
  );
}
