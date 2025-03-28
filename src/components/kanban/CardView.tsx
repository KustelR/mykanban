import Popup from "@/shared/Popup";
import React from "react";
import { createPortal } from "react-dom";

export default function CardView(props: { card: CardData }) {
  const { card } = props;
  return (
    <section
      className="min-h-52 bg-neutral-100 dark:bg-neutral-900 border-[1px] m-1 md:m-0 border-neutral-600 max-w-96 p-2 rounded-md space-y-2"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <header className="text-white bg-cyan-900/50 px-1 rounded-md font-semibold">
        {card.name}
      </header>
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
